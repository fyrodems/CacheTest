# Architektura UI dla CacheTest PWA

## 1. Przegląd struktury UI

CacheTest PWA to aplikacja webowa zaprojektowana jako środowisko testowe do badania i porównywania wydajności różnych strategii cache'owania zasobów przy użyciu Service Worker. Interfejs użytkownika jest zorganizowany wokół następującej struktury:

- **Header globalny**: Zawiera kluczowe kontrolki dostępne z każdego miejsca w aplikacji, w tym wybór strategii cache'owania, warunków sieciowych, wskaźnik online/offline, przycisk resetowania cache'a, wskaźnik wielkości cache'a i menu użytkownika.
- **Menu boczne**: Zapewnia nawigację między głównymi sekcjami aplikacji.
- **Obszar roboczy**: Główny obszar wyświetlający zawartość wybranego widoku.
- **Powiadomienia systemowe**: Toast notifications informujące o statusie testów, błędach i innych ważnych zdarzeniach.

Aplikacja składa się z czterech głównych sekcji: Dashboard (strona startowa), Strony testowe (duże obrazy, małe zasoby, dynamiczny JS), Raporty i analizy, oraz Materiały edukacyjne.

## 2. Lista widoków

### 2.1. Dashboard
- **Ścieżka**: `/`
- **Główny cel**: Centralny punkt startowy aplikacji, zawierający podsumowanie ostatnich testów, kluczowe metryki i szybki dostęp do głównych funkcji.
- **Kluczowe informacje**:
  - Wyniki ostatnich testów (podstawowe metryki)
  - Mini-raport z możliwością przejścia do pełnego raportu
  - Szybkie porównanie strategii cache'owania
  - Lista ostatnich sesji testowych
  - Krótkie opisy edukacyjne o strategiach cache'owania
- **Kluczowe komponenty**:
  - Karty z wynikami testów
  - Wykres porównawczy strategii
  - Przyciski CTA do rozpoczęcia nowych testów
  - Skrócona tabelka historii testów
  - Karty informacyjne o strategiach cache'owania
- **UX i dostępność**:
  - Wyraźne kolorystyczne oznaczenie metryk (dobry/średni/słaby wynik)
  - Responsywny układ kart dla różnych rozmiarów ekranu
  - ARIA labels dla wszystkich interaktywnych elementów

### 2.2. Strona z dużymi obrazami
- **Ścieżka**: `/test/large-images`
- **Główny cel**: Testowanie strategii cache'owania dla dużych zasobów obrazowych.
- **Kluczowe informacje**:
  - Siatka dużych obrazów testowych (min. 1MB każdy)
  - Wskaźniki wydajności w czasie rzeczywistym
  - Informacje o aktualnej strategii i warunkach sieciowych
- **Kluczowe komponenty**:
  - Grid z obrazami testowymi
  - Liczniki wydajności dla każdego obrazu
  - Przycisk rozpoczęcia/zatrzymania testu
  - Dropdown wyboru presetów testowych (po rozpoczęciu testu)
  - Timer odliczający czas trwania testu
- **UX i dostępność**:
  - Wskaźniki postępu ładowania obrazów
  - Alternatywny tekst dla obrazów
  - Możliwość zatrzymania testu w dowolnym momencie

### 2.3. Strona z małymi zasobami
- **Ścieżka**: `/test/small-resources`
- **Główny cel**: Testowanie strategii cache'owania dla małych zasobów (ikony, CSS, JS).
- **Kluczowe informacje**:
  - Siatka małych zasobów różnych typów
  - Wskaźniki wydajności w czasie rzeczywistym
  - Liczba załadowanych zasobów
- **Kluczowe komponenty**:
  - Grid z miniaturami zasobów
  - Wskaźniki czasu ładowania dla każdego typu zasobu
  - Przycisk rozpoczęcia/zatrzymania testu
  - Dropdown wyboru presetów testowych
  - Timer odliczający czas trwania testu
- **UX i dostępność**:
  - Grupowanie zasobów według typu (CSS, JS, ikony)
  - Wyraźne oznaczenie statusu ładowania

### 2.4. Strona z dynamicznym JS
- **Ścieżka**: `/test/dynamic-js`
- **Główny cel**: Testowanie strategii cache'owania dla dynamicznie ładowanego JavaScriptu.
- **Kluczowe informacje**:
  - Interaktywne demo z dynamicznie ładowanym JS
  - Wskaźniki wydajności w czasie rzeczywistym
  - Momenty inicjacji ładowania komponentów
- **Kluczowe komponenty**:
  - Interaktywne elementy wykorzystujące dynamiczny JS
  - Wizualizacja procesu ładowania modułów
  - Przycisk rozpoczęcia/zatrzymania testu
  - Dropdown wyboru presetów testowych
  - Timer odliczający czas trwania testu
- **UX i dostępność**:
  - Instrukcje obsługi interaktywnych elementów
  - Fallback dla przypadków, gdy JS nie załaduje się poprawnie

### 2.5. Raport szczegółowy
- **Ścieżka**: `/reports/:id`
- **Główny cel**: Prezentacja szczegółowych wyników testu i umożliwienie dogłębnej analizy.
- **Kluczowe informacje**:
  - Szczegółowe metryki (FP, FCP, TTI, LCP, FID, TTFB)
  - Lista załadowanych zasobów
  - Informacje o środowisku testowym
  - Porównanie z innymi strategiami
  - Rekomendacje
- **Kluczowe komponenty**:
  - Interaktywne wykresy z możliwością powiększania
  - Sortowalna i filtrowalna tabela zasobów z paginacją
  - Sekcja rekomendacji optymalnej strategii
  - Przyciski eksportu danych (CSV/JSON)
  - Przycisk trybu prezentacyjnego
- **UX i dostępność**:
  - Zakładki do przełączania między sekcjami raportu
  - Tooltips z wyjaśnieniami terminologii
  - Możliwość dostosowania widocznych kolumn w tabelach

### 2.6. Historia testów
- **Ścieżka**: `/history`
- **Główny cel**: Przeglądanie pełnej historii testów i łatwy dostęp do wcześniejszych raportów.
- **Kluczowe informacje**:
  - Lista wszystkich przeprowadzonych testów
  - Podstawowe metryki dla każdego testu
  - Informacja o użytej strategii i warunkach sieciowych
  - Data i czas testu
- **Kluczowe komponenty**:
  - Sortowalna i filtrowalna tabela z paginacją
  - Przyciski akcji (podgląd raportu, usuń)
  - Filtry zaawansowane (po strategii, warunkach, czasie)
- **UX i dostępność**:
  - Kolorystyczne oznaczenie strategii
  - Wskaźniki wydajności jako miniaturowe wykresy
  - Skróty klawiszowe do najczęstszych akcji

### 2.7. Materiały edukacyjne
- **Ścieżka**: `/education`
- **Główny cel**: Dostarczenie szczegółowych informacji o strategiach cache'owania.
- **Kluczowe informacje**:
  - Szczegółowe opisy wszystkich strategii
  - Przypadki użycia
  - Porównanie strategii
  - Najlepsze praktyki
  - Wizualizacje koncepcji
- **Kluczowe komponenty**:
  - Karty informacyjne dla każdej strategii
  - Interaktywne wizualizacje
  - Tabele porównawcze
  - Przykłady zastosowań
- **UX i dostępność**:
  - Czytelna typografia
  - Możliwość przełączania między uproszczonym a zaawansowanym trybem treści
  - Pełna nawigacja klawiszowa

### 2.8. Logowanie/Rejestracja
- **Ścieżka**: `/auth`
- **Główny cel**: Umożliwienie autoryzacji użytkownika.
- **Kluczowe informacje**:
  - Formularz logowania/rejestracji
  - Opcje autoryzacji przez OAuth
- **Kluczowe komponenty**:
  - Uproszczony formularz z minimalną liczbą pól
  - Przyciski logowania przez OAuth (Google, GitHub)
  - Komunikaty o błędach
- **UX i dostępność**:
  - Wyraźne komunikaty błędów
  - Jasne instrukcje
  - Zabezpieczenia przed automatycznymi botami

### 2.9. Tryb prezentacyjny
- **Ścieżka**: `/presentation/:id`
- **Główny cel**: Prezentacja wyników w czytelnym formacie dla zespołu/klienta.
- **Kluczowe informacje**:
  - Duże, czytelne wykresy
  - Najważniejsze metryki
  - Rekomendacje
  - Porównanie strategii
- **Kluczowe komponenty**:
  - Uproszczone, duże wykresy
  - Karty z kluczowymi metrykami
  - Minimalistyczna nawigacja
- **UX i dostępność**:
  - Tryb pełnoekranowy
  - Wysoki kontrast dla lepszej widoczności na projektorach
  - Automatyczne dopasowanie do rozdzielczości ekranu

## 3. Mapa podróży użytkownika

### 3.1. Przepływ podstawowy (testowanie)

1. **Wejście do aplikacji**
   - Użytkownik wchodzi na stronę główną (dashboard)
   - System sprawdza, czy użytkownik jest zalogowany
   - Jeśli nie, wyświetla uproszczony interfejs z opcją logowania
   - Po zalogowaniu pokazuje pełny dashboard

2. **Konfiguracja testu**
   - Użytkownik wybiera strategię cache'owania z dropdown w headerze
   - Wybiera warunki sieciowe z dropdown w headerze
   - System zapisuje wybory w localStorage

3. **Wybór podstrony testowej**
   - Użytkownik przechodzi do jednej z podstron testowych (duże obrazy, małe zasoby, dynamiczny JS)
   - System wyświetla podstronę z zasobami odpowiedniego typu

4. **Uruchomienie testu**
   - Użytkownik klika przycisk "Rozpocznij test" lub "Testuj wszystkie strategie"
   - System wyświetla opcje konfiguracji testu (presety)
   - Użytkownik wybiera preset lub kontynuuje z domyślnymi ustawieniami
   - System rozpoczyna test i wyświetla timer odliczający czas trwania

5. **Obserwacja wyników**
   - System wyświetla wskaźniki wydajności w czasie rzeczywistym
   - Użytkownik obserwuje postęp testu
   - Po zakończeniu testu system wyświetla podsumowanie

6. **Generowanie raportu**
   - Użytkownik klika przycisk "Generuj raport"
   - System przekierowuje do strony raportu z pełnymi wynikami
   - Użytkownik przegląda szczegółowe dane i analizy

### 3.2. Przepływ analizy wyników

1. **Przegląd na dashboardzie**
   - Użytkownik przegląda wyniki ostatnich testów na dashboardzie
   - Analizuje mini-raport i porównania strategii

2. **Przejście do szczegółowego raportu**
   - Użytkownik klika na wybrany test, aby zobaczyć pełny raport
   - System przekierowuje do strony raportu

3. **Analiza danych**
   - Użytkownik przełącza między zakładkami raportu (metryki, zasoby, środowisko)
   - Interaktywnie bada wykresy (zoom, hover dla szczegółów)
   - Filtruje i sortuje tabelę zasobów

4. **Wnioski i rekomendacje**
   - Użytkownik przegląda rekomendacje systemu dotyczące optymalnej strategii
   - Analizuje porównanie z innymi strategiami
   - Eksportuje dane do dalszej analizy (opcjonalnie)

5. **Przejście do trybu prezentacyjnego**
   - Użytkownik klika przycisk "Tryb prezentacyjny"
   - System otwiera uproszczony widok z dużymi wykresami, idealny do prezentacji

### 3.3. Przepływ edukacyjny

1. **Zapoznanie z krótkimi opisami**
   - Użytkownik przegląda krótkie opisy strategii na dashboardzie
   - Klika na link "Dowiedz się więcej"

2. **Przejście do materiałów edukacyjnych**
   - System przekierowuje do sekcji materiałów edukacyjnych
   - Użytkownik przegląda szczegółowe opisy strategii

3. **Eksploracja koncepcji**
   - Użytkownik zapoznaje się z przykładami i wizualizacjami
   - Przegląda tabele porównawcze strategii
   - Poznaje najlepsze praktyki

4. **Powrót do testów**
   - Użytkownik wraca do testowania z lepszym zrozumieniem tematu
   - Może bezpośrednio rozpocząć test z poziomu materiałów edukacyjnych

## 4. Układ i struktura nawigacji

### 4.1. Header globalny

Header jest zawsze widoczny na górze aplikacji i zawiera:
- Logo/nazwę aplikacji (link do dashboardu)
- Dropdown wyboru strategii cache'owania (Network-first, Cache-first, Stale-while-revalidate, Cache-then-network)
- Dropdown wyboru warunków sieciowych (dobre, wolne, przerywane, offline)
- Wskaźnik stanu online/offline (zmienia kolor w zależności od stanu)
- Przycisk natychmiastowego resetowania cache'a
- Wskaźnik wielkości cache'a
- Menu użytkownika z opcjami logowania/wylogowania

### 4.2. Menu boczne

Menu boczne zapewnia nawigację między głównymi sekcjami aplikacji:
- Dashboard
- Testy
  - Duże obrazy
  - Małe zasoby
  - Dynamiczny JS
- Raporty
- Historia testów
- Materiały edukacyjne
- Ustawienia (opcjonalnie)

### 4.3. Nawigacja kontekstowa

W zależności od aktualnego widoku, dostępne są dodatkowe opcje nawigacyjne:
- **Dashboard**: Szybkie linki do stron testowych, raportów, historii
- **Strony testowe**: Przyciski do uruchamiania testów, wybór presetów
- **Raport**: Zakładki do przełączania między sekcjami, przyciski eksportu i trybu prezentacyjnego
- **Historia testów**: Filtry, sortowanie, przyciski akcji dla poszczególnych testów
- **Materiały edukacyjne**: Nawigacja między różnymi koncepcjami i strategiami

### 4.4. Ścieżki nawigacyjne

Aplikacja wykorzystuje następujące wzorce nawigacyjne:
- **Hierarchiczna nawigacja**: Menu boczne prowadzi do głównych sekcji
- **Sekwencyjna nawigacja**: Przepływ od konfiguracji testu przez wykonanie do analizy wyników
- **Kontekstowa nawigacja**: Przyciski i linki dostosowane do aktualnego kontekstu
- **Bezpośrednia nawigacja**: Możliwość szybkiego dostępu do kluczowych funkcji z dashboardu

## 5. Kluczowe komponenty

### 5.1. Kontrolki globalne
- **StrategyDropdown**: Dropdown do wyboru strategii cache'owania
- **NetworkConditionDropdown**: Dropdown do wyboru warunków sieciowych
- **OnlineIndicator**: Wskaźnik stanu online/offline
- **CacheResetButton**: Przycisk do resetowania cache'a
- **CacheSizeIndicator**: Wskaźnik rozmiaru cache'a
- **UserMenu**: Menu użytkownika z opcjami logowania/wylogowania

### 5.2. Komponenty dashboardu
- **TestResultCard**: Karta z wynikami testu
- **MiniReport**: Skrócony raport z odnośnikiem do pełnej wersji
- **StrategyComparisonChart**: Wykres porównujący strategie
- **RecentTestsList**: Lista ostatnich testów
- **EducationalCard**: Karta z krótkim opisem strategii
- **ActionButton**: Przycisk CTA do rozpoczęcia testu

### 5.3. Komponenty testowe
- **ResourceGrid**: Siatka zasobów (obrazy, małe pliki, elementy JS)
- **PerformanceIndicator**: Wskaźnik wydajności w czasie rzeczywistym
- **TestControlPanel**: Panel kontrolny testu (start/stop)
- **PresetSelector**: Wybór presetów testowych
- **TestTimer**: Timer odliczający czas trwania testu
- **TestProgressBar**: Pasek postępu testu

### 5.4. Komponenty analityczne
- **InteractiveChart**: Interaktywny wykres z funkcjami zoom/hover
- **MetricsTable**: Tabela z metrykami wydajności
- **ResourcesTable**: Paginowana tabela zasobów z filtrowaniem i sortowaniem
- **RecommendationPanel**: Panel z rekomendacjami optymalnej strategii
- **ExportButton**: Przycisk eksportu danych (CSV/JSON)
- **PresentationModeButton**: Przycisk przejścia do trybu prezentacyjnego

### 5.5. Komponenty pomocnicze
- **Toast**: Powiadomienie typu toast dla komunikatów systemowych
- **TabPanel**: Panel z zakładkami do przełączania między widokami
- **Pagination**: Komponent paginacji dla tabel i list
- **FilterPanel**: Panel filtrów dla tabel i list
- **LoadingIndicator**: Wskaźnik ładowania
- **ErrorMessage**: Komponent wyświetlający błędy z wyjaśnieniami 