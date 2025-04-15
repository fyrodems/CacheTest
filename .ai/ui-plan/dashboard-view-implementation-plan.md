# Plan implementacji widoku Dashboard

## 1. Przegląd
Dashboard to centralny punkt startowy aplikacji CacheTest PWA, zawierający podsumowanie ostatnich testów, kluczowe metryki wydajności różnych strategii cache'owania oraz szybki dostęp do głównych funkcji aplikacji. Widok ten pozwala deweloperom na szybką ocenę wyników testów, porównanie strategii i rozpoczęcie nowych sesji testowych.

## 2. Routing widoku
Widok będzie dostępny pod główną ścieżką aplikacji: `/`

## 3. Struktura komponentów
```
Dashboard
├── DashboardHeader
├── TestResultsOverview
│   └── TestResultCard (dla każdego wyniku)
├── MiniReport
├── StrategyComparisonChart
├── RecentTestSessionsList
│   └── TestSessionItem (dla każdej sesji)
├── CachingStrategiesInfo
│   └── StrategyCard (dla każdej strategii)
├── ActionButtons
└── CacheResetButton
```

## 4. Szczegóły komponentów

### DashboardHeader
- Opis komponentu: Nagłówek dashboardu zawierający tytuł i opis
- Główne elementy: Heading (h1), tekst opisujący cel aplikacji, ikony
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: Brak specyficznych typów
- Propsy: `title: string`, `description: string`

### TestResultsOverview
- Opis komponentu: Komponent wyświetlający przegląd wyników ostatnich testów w formie kart
- Główne elementy: Heading (h2), grid z kartami TestResultCard, stan ładowania, komunikat o braku danych
- Obsługiwane interakcje: Kliknięcie karty (przekierowanie do szczegółowego raportu)
- Obsługiwana walidacja: Sprawdzenie czy dane są dostępne, obsługa stanu ładowania
- Typy: `TestResultCardViewModel[]`
- Propsy: `testResults: TestResultCardViewModel[]`, `isLoading: boolean`, `error: Error | null`

### TestResultCard
- Opis komponentu: Karta prezentująca podstawowe informacje o wyniku testu
- Główne elementy: Heading (h3), nazwa strategii, metryki wydajności, wskaźnik wydajności
- Obsługiwane interakcje: Kliknięcie (przekierowanie do szczegółowego raportu)
- Obsługiwana walidacja: Brak
- Typy: `TestResultCardViewModel`
- Propsy: `result: TestResultCardViewModel`

### MiniReport
- Opis komponentu: Skrócony raport z jednego z ostatnich testów z możliwością przejścia do pełnego raportu
- Główne elementy: Heading (h2), podstawowe metryki, wykres, przycisk "Zobacz pełny raport"
- Obsługiwane interakcje: Kliknięcie przycisku "Zobacz pełny raport"
- Obsługiwana walidacja: Sprawdzenie czy dane są dostępne
- Typy: `MiniReportViewModel`
- Propsy: `report: MiniReportViewModel`, `isLoading: boolean`, `error: Error | null`

### StrategyComparisonChart
- Opis komponentu: Wykres porównujący wyniki różnych strategii cache'owania
- Główne elementy: Heading (h2), wykres interaktywny, legenda, tooltips
- Obsługiwane interakcje: Hover nad elementami wykresu (wyświetlanie szczegółów)
- Obsługiwana walidacja: Sprawdzenie czy dane są dostępne, obsługa stanu ładowania
- Typy: `StrategyComparisonViewModel`
- Propsy: `data: StrategyComparisonViewModel`, `isLoading: boolean`, `error: Error | null`

### RecentTestSessionsList
- Opis komponentu: Lista ostatnich sesji testowych
- Główne elementy: Heading (h2), tabela z wierszami TestSessionItem, stan ładowania, komunikat o braku danych
- Obsługiwane interakcje: Kliknięcie wiersza (przekierowanie do szczegółów sesji)
- Obsługiwana walidacja: Sprawdzenie czy dane są dostępne
- Typy: `RecentTestSessionViewModel[]`
- Propsy: `sessions: RecentTestSessionViewModel[]`, `isLoading: boolean`, `error: Error | null`

### TestSessionItem
- Opis komponentu: Wiersz w tabeli z informacjami o sesji testowej
- Główne elementy: Nazwa sesji, data utworzenia, czas trwania, liczba testów
- Obsługiwane interakcje: Kliknięcie (przekierowanie do szczegółów sesji)
- Obsługiwana walidacja: Brak
- Typy: `RecentTestSessionViewModel`
- Propsy: `session: RecentTestSessionViewModel`

### CachingStrategiesInfo
- Opis komponentu: Sekcja z kartami informacyjnymi o strategiach cache'owania
- Główne elementy: Heading (h2), grid z kartami StrategyCard
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: `CachingStrategyInfoViewModel[]`
- Propsy: `strategies: CachingStrategyInfoViewModel[]`

### StrategyCard
- Opis komponentu: Karta z informacjami o konkretnej strategii cache'owania
- Główne elementy: Heading (h3), opis strategii, przypadki użycia, link "Dowiedz się więcej"
- Obsługiwane interakcje: Kliknięcie linku "Dowiedz się więcej"
- Obsługiwana walidacja: Brak
- Typy: `CachingStrategyInfoViewModel`
- Propsy: `strategy: CachingStrategyInfoViewModel`

### ActionButtons
- Opis komponentu: Przyciski CTA do rozpoczęcia nowych testów
- Główne elementy: Heading (h2), przyciski dla różnych typów testów
- Obsługiwane interakcje: Kliknięcia przycisków (przekierowanie do stron testowych)
- Obsługiwana walidacja: Brak
- Typy: Brak specyficznych typów
- Propsy: Brak

### CacheResetButton
- Opis komponentu: Przycisk do resetowania cache'a przeglądarki
- Główne elementy: Przycisk, ikona, tooltip z wyjaśnieniem
- Obsługiwane interakcje: Kliknięcie przycisku (wywołanie funkcji resetowania cache'a)
- Obsługiwana walidacja: Sprawdzenie czy operacja się powiodła
- Typy: Brak specyficznych typów
- Propsy: `onReset: () => Promise<void>`, `isResetting: boolean`

## 5. Typy

### TestResultCardViewModel
```typescript
type TestResultCardViewModel = {
  id: string;
  strategy_type: string;
  timestamp_end: string;
  session_id: string;
  metrics: {
    fp?: number | null;
    fcp?: number | null;
    tti?: number | null;
    lcp?: number | null;
    fid?: number | null;
    ttfb?: number | null;
    offline_availability?: boolean | null;
  };
  performanceIndicator: 'good' | 'medium' | 'poor';
};
```

### MiniReportViewModel
```typescript
type MiniReportViewModel = {
  id: string;
  strategy_type: string;
  timestamp_end: string;
  metrics: {
    fp?: number | null;
    fcp?: number | null;
    tti?: number | null;
    lcp?: number | null;
    fid?: number | null;
    ttfb?: number | null;
    offline_availability?: boolean | null;
  };
  performanceIndicator: 'good' | 'medium' | 'poor';
};
```

### StrategyComparisonViewModel
```typescript
type StrategyComparisonViewModel = {
  strategies: string[];
  metrics: Record<string, number[]>;
  bestStrategy: string;
  bestMetrics: Record<string, string>;
};
```

### RecentTestSessionViewModel
```typescript
type RecentTestSessionViewModel = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  duration: string | null;
  testCount?: number;
};
```

### CachingStrategyInfoViewModel
```typescript
type CachingStrategyInfoViewModel = {
  name: string;
  description: string;
  useCase: string;
  learnMoreUrl: string;
};
```

## 6. Zarządzanie stanem

Do zarządzania stanem wykorzystamy custom hook `useDashboardData`, który będzie odpowiedzialny za:
- Pobieranie danych potrzebnych dla dashboardu
- Przechowywanie stanu ładowania
- Obsługę błędów
- Transformację danych z API do postaci wymaganej przez komponenty

```typescript
function useDashboardData() {
  const [testResults, setTestResults] = useState<TestResultCardViewModel[]>([]);
  const [isLoadingTestResults, setIsLoadingTestResults] = useState<boolean>(true);
  const [errorTestResults, setErrorTestResults] = useState<Error | null>(null);
  
  const [testSessions, setTestSessions] = useState<RecentTestSessionViewModel[]>([]);
  const [isLoadingTestSessions, setIsLoadingTestSessions] = useState<boolean>(true);
  const [errorTestSessions, setErrorTestSessions] = useState<Error | null>(null);
  
  const [strategyComparison, setStrategyComparison] = useState<StrategyComparisonViewModel | null>(null);
  const [isLoadingStrategyComparison, setIsLoadingStrategyComparison] = useState<boolean>(true);
  const [errorStrategyComparison, setErrorStrategyComparison] = useState<Error | null>(null);
  
  const [isResettingCache, setIsResettingCache] = useState<boolean>(false);
  const [resetCacheError, setResetCacheError] = useState<Error | null>(null);
  
  // Metody pobierania danych
  const fetchTestResults = useCallback(async () => {...});
  const fetchTestSessions = useCallback(async () => {...});
  const fetchStrategyComparison = useCallback(async () => {...});
  const resetCache = useCallback(async () => {...});
  
  // Efekt pobierający dane po zamontowaniu komponentu
  useEffect(() => {
    fetchTestResults();
    fetchTestSessions();
    fetchStrategyComparison();
  }, [fetchTestResults, fetchTestSessions, fetchStrategyComparison]);
  
  return {
    testResults,
    isLoadingTestResults,
    errorTestResults,
    testSessions,
    isLoadingTestSessions,
    errorTestSessions,
    strategyComparison,
    isLoadingStrategyComparison,
    errorStrategyComparison,
    resetCache,
    isResettingCache,
    resetCacheError
  };
}
```

## 7. Integracja API

Dashboard będzie korzystać z następujących endpointów API:

### Pobieranie wyników testów
```typescript
const fetchTestResults = async () => {
  try {
    setIsLoadingTestResults(true);
    const response = await fetch('/api/test-results?limit=5&sort=timestamp_end&order=desc');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: TestResultListResponseDTO = await response.json();
    
    // Transformacja danych z API do ViewModel
    const viewModels: TestResultCardViewModel[] = data.data.map(result => ({
      id: result.id,
      strategy_type: result.strategy_type,
      timestamp_end: result.timestamp_end,
      session_id: result.session_id,
      metrics: {
        fp: result.fp,
        fcp: result.fcp,
        tti: result.tti,
        lcp: result.lcp,
        fid: result.fid,
        ttfb: result.ttfb,
        offline_availability: result.offline_availability
      },
      performanceIndicator: calculatePerformanceIndicator(result)
    }));
    
    setTestResults(viewModels);
  } catch (error) {
    setErrorTestResults(error instanceof Error ? error : new Error('Nieznany błąd'));
  } finally {
    setIsLoadingTestResults(false);
  }
};
```

### Pobieranie sesji testowych
```typescript
const fetchTestSessions = async () => {
  try {
    setIsLoadingTestSessions(true);
    const response = await fetch('/api/test-sessions?limit=5&sort=created_at&order=desc');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: TestSessionListResponseDTO = await response.json();
    
    // Transformacja danych z API do ViewModel
    const viewModels: RecentTestSessionViewModel[] = data.data.map(session => ({
      id: session.id,
      name: session.name,
      description: session.description,
      created_at: session.created_at,
      duration: session.duration
    }));
    
    setTestSessions(viewModels);
  } catch (error) {
    setErrorTestSessions(error instanceof Error ? error : new Error('Nieznany błąd'));
  } finally {
    setIsLoadingTestSessions(false);
  }
};
```

### Pobieranie porównania strategii
```typescript
const fetchStrategyComparison = async () => {
  try {
    setIsLoadingStrategyComparison(true);
    
    // Pobierz najpierw wyniki ostatnich testów dla różnych strategii
    const response = await fetch('/api/test-results?limit=20&sort=timestamp_end&order=desc');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: TestResultListResponseDTO = await response.json();
    
    // Znajdź po jednym wyniku dla każdej strategii
    const strategyMap = new Map<string, string>();
    for (const result of data.data) {
      if (!strategyMap.has(result.strategy_type)) {
        strategyMap.set(result.strategy_type, result.id);
      }
    }
    
    const ids = Array.from(strategyMap.values());
    
    if (ids.length <= 1) {
      setStrategyComparison(null);
      return;
    }
    
    // Pobierz porównanie tych wyników
    const comparisonResponse = await fetch(`/api/test-results/compare?ids=${ids.join(',')}`);
    
    if (!comparisonResponse.ok) {
      throw new Error(`HTTP error! Status: ${comparisonResponse.status}`);
    }
    
    const comparisonData: TestResultComparisonResponseDTO = await comparisonResponse.json();
    
    // Transformacja danych do ViewModel
    const strategies = comparisonData.results.map(r => r.strategy_type);
    const metrics: Record<string, number[]> = {
      fp: comparisonData.results.map(r => r.metrics.fp || 0),
      fcp: comparisonData.results.map(r => r.metrics.fcp || 0),
      tti: comparisonData.results.map(r => r.metrics.tti || 0),
      lcp: comparisonData.results.map(r => r.metrics.lcp || 0),
      fid: comparisonData.results.map(r => r.metrics.fid || 0),
      ttfb: comparisonData.results.map(r => r.metrics.ttfb || 0)
    };
    
    const bestStrategy = comparisonData.results.find(
      r => r.id === comparisonData.comparison.best_overall
    )?.strategy_type || '';
    
    const bestMetrics: Record<string, string> = {
      fp: comparisonData.results.find(
        r => r.id === comparisonData.comparison.metrics_comparison.fp?.best
      )?.strategy_type || '',
      // ... podobnie dla pozostałych metryk
    };
    
    setStrategyComparison({
      strategies,
      metrics,
      bestStrategy,
      bestMetrics
    });
  } catch (error) {
    setErrorStrategyComparison(error instanceof Error ? error : new Error('Nieznany błąd'));
  } finally {
    setIsLoadingStrategyComparison(false);
  }
};
```

### Resetowanie cache'a
```typescript
const resetCache = async () => {
  try {
    setIsResettingCache(true);
    const response = await fetch('/api/cache/reset', {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: CacheResetResponseDTO = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }
    
    // Odświeżenie danych po zresetowaniu cache'a
    fetchTestResults();
    fetchTestSessions();
    fetchStrategyComparison();
  } catch (error) {
    setResetCacheError(error instanceof Error ? error : new Error('Nieznany błąd'));
  } finally {
    setIsResettingCache(false);
  }
};
```

## 8. Interakcje użytkownika

1. **Kliknięcie na kartę wyniku testu (TestResultCard)**
   - Przekierowanie do szczegółowego raportu z wykorzystaniem API routingu Astro
   - Przekazanie ID wyniku testu w URL

2. **Kliknięcie na przycisk "Zobacz pełny raport" (MiniReport)**
   - Przekierowanie do szczegółowego raportu
   - Przekazanie ID wyniku testu w URL

3. **Interakcja z wykresem porównawczym (StrategyComparisonChart)**
   - Wyświetlenie tooltipa z dokładnymi wartościami po najechaniu na słupek/punkt wykresu
   - Wykorzystanie biblioteki do wykresów (np. Chart.js, Recharts)

4. **Kliknięcie na sesję testową (TestSessionItem)**
   - Przekierowanie do szczegółów sesji
   - Przekazanie ID sesji w URL

5. **Kliknięcie na link "Dowiedz się więcej" (StrategyCard)**
   - Przekierowanie do materiałów edukacyjnych o danej strategii
   - Przekazanie nazwy strategii w URL

6. **Kliknięcie na przycisk rozpoczęcia testu (ActionButtons)**
   - Przekierowanie do odpowiedniej strony testowej
   - Opcjonalne przekazanie parametrów (typ strategii) w URL

7. **Kliknięcie na przycisk resetowania cache'a (CacheResetButton)**
   - Wywołanie funkcji resetowania cache'a
   - Wyświetlenie stanu ładowania podczas resetowania
   - Po zakończeniu wyświetlenie potwierdzenia (toast notification)

## 9. Warunki i walidacja

1. **Warunki dostępu do danych API**
   - Weryfikacja na poziomie hooka: sprawdzenie czy użytkownik jest zalogowany
   - W przypadku błędu 401 (Unauthorized) - przekierowanie do strony logowania
   - W przypadku błędu 403 (Forbidden) - wyświetlenie komunikatu o braku dostępu

2. **Walidacja danych testowych**
   - Sprawdzenie czy dane są dostępne przed renderowaniem
   - Wyświetlenie stanu ładowania podczas pobierania danych
   - Wyświetlenie komunikatu o braku danych, jeśli dane nie są dostępne

3. **Walidacja resetowania cache'a**
   - Sprawdzenie czy operacja się powiodła
   - W przypadku błędu - wyświetlenie komunikatu z możliwością ponownej próby

4. **Walidacja wyświetlania porównania strategii**
   - Wymagane co najmniej dwie różne strategie do porównania
   - W przypadku braku wystarczającej liczby strategii - wyświetlenie komunikatu

## 10. Obsługa błędów

1. **Błąd pobierania danych**
   - Wyświetlenie komunikatu o błędzie w miejscu komponentu
   - Przycisk do ponownej próby pobrania danych
   - Logging błędu do systemu monitoringu

2. **Brak danych**
   - Stan pusty z komunikatem zachęcającym do rozpoczęcia testów
   - W komponencie TestResultsOverview: "Brak wyników testów. Rozpocznij nowy test, aby zobaczyć wyniki."
   - W komponencie RecentTestSessionsList: "Brak sesji testowych. Utwórz nową sesję, aby rozpocząć testy."
   - W komponencie StrategyComparisonChart: "Brak wystarczających danych do porównania strategii. Przeprowadź testy z różnymi strategiami."

3. **Błąd resetowania cache'a**
   - Wyświetlenie komunikatu o błędzie w toast notification
   - Instrukcje ręcznego resetowania cache'a
   - Przycisk do ponownej próby

4. **Błąd autoryzacji**
   - Obsługa przekierowania do strony logowania
   - Zachowanie URL, do którego użytkownik próbował uzyskać dostęp, aby powrócić po zalogowaniu

## 11. Kroki implementacji

1. **Utworzenie struktury plików**
   - Utworzenie pliku strony `src/pages/index.astro`
   - Utworzenie plików komponentów w `src/components/dashboard/`
   - Utworzenie hooka `src/lib/hooks/useDashboardData.ts`

2. **Implementacja modeli danych**
   - Zdefiniowanie typów ViewModel w `src/lib/types/dashboard.ts`
   - Implementacja funkcji mapujących dane z API do ViewModels

3. **Implementacja hooka useDashboardData**
   - Implementacja funkcji pobierania danych z API
   - Implementacja logiki transformacji danych
   - Implementacja obsługi błędów

4. **Implementacja głównego komponentu Dashboard**
   - Integracja z hookiem useDashboardData
   - Implementacja layoutu z wykorzystaniem Tailwind
   - Obsługa stanów ładowania i błędów

5. **Implementacja komponentów potomnych**
   - Implementacja komponentu TestResultsOverview i TestResultCard
   - Implementacja komponentu MiniReport
   - Implementacja komponentu StrategyComparisonChart
   - Implementacja komponentu RecentTestSessionsList i TestSessionItem
   - Implementacja komponentu CachingStrategiesInfo i StrategyCard
   - Implementacja komponentu ActionButtons
   - Implementacja komponentu CacheResetButton

6. **Integracja z biblioteką wykresów**
   - Wybór biblioteki do wizualizacji danych (np. Chart.js, Recharts)
   - Implementacja komponentu wykresu porównawczego
   - Stylowanie wykresu zgodnie z designem aplikacji

7. **Implementacja interakcji użytkownika**
   - Dodanie obsługi zdarzeń do komponentów
   - Implementacja przekierowań do innych stron
   - Testowanie interakcji

8. **Implementacja obsługi błędów**
   - Dodanie komponentów wyświetlających komunikaty o błędach
   - Implementacja mechanizmu ponownego pobierania danych
   - Testowanie różnych scenariuszy błędów

9. **Optymalizacja wydajności**
   - Implementacja memoizacji komponentów React
   - Optymalizacja zapytań do API (caching, ponowne użycie danych)
   - Implementacja lazy loading dla wykresu porównawczego

10. **Testowanie**
    - Testowanie na różnych rozmiarach ekranu (responsywność)
    - Testowanie z różnymi zestawami danych
    - Testowanie scenariuszy błędów
    - Testowanie wydajności 