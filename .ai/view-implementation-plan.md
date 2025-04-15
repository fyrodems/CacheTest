# API Endpoint Implementation Plan: GET /api/test-results/{id}

## 1. Przegląd punktu końcowego

Ten endpoint pozwala na pobranie szczegółowych informacji o konkretnym wyniku testu na podstawie jego identyfikatora. Wyniki testów zawierają metryki wydajności dla różnych strategii cache'owania, co jest kluczowe dla funkcjonalności aplikacji CacheTest PWA.

Endpoint zapewnia:
- Dostęp do pełnych danych pojedynczego wyniku testu
- Zabezpieczenie, aby użytkownicy mieli dostęp tylko do swoich własnych wyników testów
- Zwrot wszystkich metryk wydajności oraz surowych danych pomiaru

## 2. Szczegóły żądania

- **Metoda HTTP**: GET
- **Struktura URL**: `/api/test-results/{id}`
- **Parametry**:
  - **Wymagane**: 
    - `id` (UUID): Unikalny identyfikator wyniku testu w ścieżce URL
  - **Opcjonalne**: Brak

## 3. Wykorzystywane typy

- **TestResultResponseDTO**: Główny typ odpowiedzi zawierający wszystkie dane wyniku testu
- **Tables\<"test_results"\>**: Podstawowy typ encji z bazy danych
- **Json**: Typ dla złożonych danych JSON (raw_metrics)

## 4. Szczegóły odpowiedzi

- **Format**: JSON
- **Struktura**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "strategy_type": "string",
    "fp": "number",
    "fcp": "number",
    "tti": "number",
    "lcp": "number",
    "fid": "number",
    "ttfb": "number",
    "offline_availability": "boolean",
    "timestamp_start": "timestamp",
    "timestamp_end": "timestamp",
    "raw_metrics": "object"
  }
  ```
- **Kody statusu**:
  - 200: Sukces - wynik testu został znaleziony i zwrócony
  - 401: Nieautoryzowany - użytkownik nie jest zalogowany
  - 403: Zabroniony - użytkownik nie ma dostępu do tego wyniku testu
  - 404: Nie znaleziono - wynik testu o podanym ID nie istnieje

## 5. Przepływ danych

1. Otrzymanie żądania GET z parametrem ID wyniku testu
2. Walidacja formatu ID (poprawny UUID)
3. Pobranie klienta Supabase z kontekstu lokalnego Astro
4. Wykonanie zapytania do tabeli `test_results` o wynik testu z podanym ID
5. Wykorzystanie Row Level Security (RLS) do zapewnienia, że użytkownik ma dostęp tylko do swoich danych
6. Sprawdzenie, czy wynik testu istnieje
7. Zwrócenie wyniku testu jako odpowiedzi JSON

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie**: Endpoint wymaga, aby użytkownik był zalogowany (JWT token)
- **Autoryzacja**: 
  - Wykorzystanie Row Level Security (RLS) Supabase do zapewnienia, że użytkownicy mają dostęp tylko do swoich wyników testów
  - RLS Policy: `test_results_select_auth` gwarantuje, że użytkownicy mogą odczytywać wyniki tylko dla swoich sesji
- **Walidacja danych**: 
  - Walidacja ID jako poprawnego UUID za pomocą Zod

## 7. Obsługa błędów

| Scenariusz błędu | Kod statusu | Komunikat | Akcja |
|------------------|-------------|-----------|-------|
| Niepoprawny format ID | 400 | "Invalid test result ID format. UUID expected." | Walidacja ID za pomocą Zod |
| Użytkownik nie jest zalogowany | 401 | "Authentication required." | Sprawdzenie tokenu JWT |
| Brak dostępu do wyniku testu | 403 | "Access denied to this test result." | RLS automatycznie obsługuje to ograniczenie |
| Wynik testu nie istnieje | 404 | "Test result not found." | Sprawdzenie, czy zwrócony wynik nie jest null |
| Błąd serwera/bazy danych | 500 | "Internal server error." | Obsługa wyjątków, logowanie błędów |

## 8. Rozważania dotyczące wydajności

- Supabase automatycznie korzysta z indeksu na kolumnie ID (klucz główny), zapewniając szybkie wyszukiwanie
- Indeks `idx_test_results_session_id` jest używany do weryfikacji dostępu przez RLS
- Odpowiedź zawiera całe surowe dane metryki (raw_metrics), co może wpłynąć na rozmiar odpowiedzi - rozważyć opcjonalne ładowanie tych danych w przyszłości
- Buforowanie odpowiedzi nie jest zalecane, ponieważ dane są specyficzne dla użytkownika

## 9. Etapy wdrożenia

1. **Utworzenie pliku API endpoint**:
   ```typescript
   // src/pages/api/test-results/[id].ts
   import { z } from 'zod';
   import type { APIRoute } from 'astro';
   import type { TestResultResponseDTO } from '../../../types';
   
   // Zdefiniowanie schematu walidacji
   const idSchema = z.string().uuid({
     message: "Invalid test result ID format. UUID expected."
   });
   
   export const get: APIRoute = async ({ params, locals, request }) => {
     try {
       // 1. Walidacja ID
       const validationResult = idSchema.safeParse(params.id);
       if (!validationResult.success) {
         return new Response(
           JSON.stringify({ error: validationResult.error.message }),
           { status: 400, headers: { 'Content-Type': 'application/json' } }
         );
       }
       
       const id = validationResult.data;
       
       // 2. Pobranie klienta Supabase z kontekstu
       const supabase = locals.supabase;
       
       // 3. Zapytanie do bazy danych (RLS automatycznie filtruje dostęp)
       const { data, error } = await supabase
         .from('test_results')
         .select('*')
         .eq('id', id)
         .single();
       
       // 4. Obsługa błędów
       if (error) {
         if (error.code === 'PGRST116') {
           // Błąd "row not found" z postgREST
           return new Response(
             JSON.stringify({ error: "Test result not found." }),
             { status: 404, headers: { 'Content-Type': 'application/json' } }
           );
         }
         
         console.error('Database error:', error);
         return new Response(
           JSON.stringify({ error: "Internal server error." }),
           { status: 500, headers: { 'Content-Type': 'application/json' } }
         );
       }
       
       // 5. Zwrócenie wyniku
       return new Response(
         JSON.stringify(data as TestResultResponseDTO),
         { status: 200, headers: { 'Content-Type': 'application/json' } }
       );
       
     } catch (error) {
       console.error('Unexpected error:', error);
       return new Response(
         JSON.stringify({ error: "Internal server error." }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
       );
     }
   };
   ```

2. **Testowanie endpointu**:
   - Upewnij się, że wszystkie zależności są zainstalowane (`zod`)
   - Przetestuj endpoint z różnymi scenariuszami:
     - Poprawne ID dla własnego wyniku testu (oczekiwany kod 200)
     - Niepoprawny format ID (oczekiwany kod 400)
     - ID nieistniejącego wyniku testu (oczekiwany kod 404)
     - ID wyniku testu należącego do innego użytkownika (oczekiwany kod 403 przez RLS)
     - Żądanie bez uwierzytelnienia (oczekiwany kod 401)

3. **Dokumentacja i testy**:
   - Dodaj komentarze wyjaśniające logikę działania
   - Rozważ dodanie testów jednostkowych i/lub integracyjnych
   - Aktualizacja dokumentacji API, jeśli istnieje 