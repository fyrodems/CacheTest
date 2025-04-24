# Plan implementacji widoków zasobów i raportu szczegółowego

## 1. Przegląd

Plan implementacji obejmuje cztery kluczowe widoki aplikacji CacheTest PWA:
- Strona z dużymi obrazami - do testowania strategii cache'owania dla dużych zasobów graficznych
- Strona z małymi zasobami - do testowania strategii cache'owania dla wielu małych zasobów (ikony, CSS, JS)
- Strona z dynamicznie ładowanym JavaScript - do testowania strategii cache'owania dla dynamicznie ładowanego kodu JS
- Raport szczegółowy - do prezentacji i analizy wyników testów

Widoki te pozwolą użytkownikom testować różne strategie cache'owania w kontrolowanym środowisku, mierzyć wskaźniki wydajności i generować raporty z wynikami.

## 2. Routing widoku

- Strona z dużymi obrazami: `/test/large-images`
- Strona z małymi zasobami: `/test/small-resources`
- Strona z dynamicznym JS: `/test/dynamic-js`
- Raport szczegółowy: `/reports/:id`

## 3. Struktura komponentów

```
App
├── Layout (Shared)
│   ├── Header
│   │   ├── StrategySelector
│   │   ├── NetworkConditionSelector
│   │   ├── OnlineIndicator
│   │   └── ResetCacheButton
│   └── SideMenu
│
├── LargeImagesPage (/test/large-images)
│   ├── TestControls
│   ├── PerformanceMetrics
│   └── LargeImagesGrid
│       └── ImagePerformanceIndicator (dla każdego obrazu)
│
├── SmallResourcesPage (/test/small-resources)
│   ├── TestControls
│   ├── PerformanceMetrics
│   └── SmallResourcesGrid
│       ├── ResourceTypeGroup (CSS)
│       ├── ResourceTypeGroup (JS)
│       └── ResourceTypeGroup (Icons)
│
├── DynamicJSPage (/test/dynamic-js)
│   ├── TestControls
│   ├── PerformanceMetrics
│   ├── DynamicJSDemo
│   └── ModuleLoadingVisualization
│
└── ReportPage (/reports/:id)
    ├── MetricsCharts
    │   ├── Chart (dla każdej metryki)
    │   └── StrategyComparisonChart
    ├── ResourcesTable
    ├── RecommendationsPanel
    └── ExportButton
```

## 4. Szczegóły komponentów

### Komponenty współdzielone (shared)

#### StrategySelector
- Opis komponentu: Dropdown do wyboru strategii cache'owania
- Główne elementy: Dropdown z listą 4 strategii (Network-first, Cache-first, Stale-while-revalidate, Cache-then-network)
- Obsługiwane interakcje: Zmiana wybranej strategii
- Obsługiwana walidacja: Sprawdzenie, czy wybrana strategia jest jedną z czterech dostępnych
- Typy: `CachingStrategy` (enum)
- Propsy: `value`, `onChange`, `disabled`

#### NetworkConditionSelector
- Opis komponentu: Dropdown do wyboru warunków sieciowych
- Główne elementy: Dropdown z listą 4 warunków (dobre, wolne, przerywane, offline)
- Obsługiwane interakcje: Zmiana wybranych warunków sieciowych
- Obsługiwana walidacja: Sprawdzenie, czy wybrane warunki są jednym z czterech dostępnych typów
- Typy: `NetworkCondition` (enum)
- Propsy: `value`, `onChange`, `disabled`

#### ResetCacheButton
- Opis komponentu: Przycisk do resetowania cache'a
- Główne elementy: Przycisk z ikoną i tekstem
- Obsługiwane interakcje: Kliknięcie przycisku resetowania
- Obsługiwana walidacja: Brak
- Propsy: `onClick`, `disabled`, `isResetting`

#### TestControls
- Opis komponentu: Panel kontrolny testu (start/stop, preset)
- Główne elementy: Przyciski Start/Stop, dropdown wyboru presetu, timer
- Obsługiwane interakcje: Start testu, stop testu, wybór presetu, reset testu
- Obsługiwana walidacja: Test nie może być uruchomiony, jeśli inny jest w trakcie
- Typy: `TestConfigViewModel`, `TestStateViewModel`
- Propsy: `testConfig`, `testState`, `onStart`, `onStop`, `onReset`, `onPresetChange`

#### PerformanceMetrics
- Opis komponentu: Wyświetlanie wskaźników wydajności
- Główne elementy: Karty z poszczególnymi metrykami (FP, FCP, TTI, LCP, FID, TTFB)
- Obsługiwane interakcje: Brak (komponent informacyjny)
- Obsługiwana walidacja: Sprawdzenie, czy metryki są liczbami (lub null)
- Typy: `PerformanceMetricsViewModel`
- Propsy: `metrics`, `isLoading`

### Strona z dużymi obrazami (/test/large-images)

#### LargeImagesPage
- Opis komponentu: Główny komponent strony z dużymi obrazami
- Główne elementy: TestControls, PerformanceMetrics, LargeImagesGrid
- Obsługiwane interakcje: Uruchamianie testów, przeglądanie wyników
- Obsługiwana walidacja: Sprawdzenie stanu testu przed rozpoczęciem/zatrzymaniem
- Typy: `LargeImagesPageViewModel`

#### LargeImagesGrid
- Opis komponentu: Siatka dużych obrazów testowych
- Główne elementy: Grid z dużymi obrazami, indykatory ładowania
- Obsługiwane interakcje: Ładowanie obrazów (automatyczne)
- Obsługiwana walidacja: Sprawdzenie, czy obrazy są dostępne
- Typy: `TestImageViewModel[]`
- Propsy: `images`, `isTestRunning`

#### ImagePerformanceIndicator
- Opis komponentu: Wskaźnik wydajności dla poszczególnych obrazów
- Główne elementy: Pasek postępu, licznik czasu, indykator statusu (załadowany/błąd)
- Obsługiwane interakcje: Brak (komponent informacyjny)
- Obsługiwana walidacja: Sprawdzenie, czy metryka jest liczbą (lub null)
- Typy: `TestImageViewModel`
- Propsy: `image`

### Strona z małymi zasobami (/test/small-resources)

#### SmallResourcesPage
- Opis komponentu: Główny komponent strony z małymi zasobami
- Główne elementy: TestControls, PerformanceMetrics, SmallResourcesGrid
- Obsługiwane interakcje: Uruchamianie testów, przeglądanie wyników
- Obsługiwana walidacja: Sprawdzenie stanu testu przed rozpoczęciem/zatrzymaniem
- Typy: `SmallResourcesPageViewModel`

#### SmallResourcesGrid
- Opis komponentu: Siatka małych zasobów (ikony, CSS, JS)
- Główne elementy: Zakładki dla typów zasobów, grid z zasobami
- Obsługiwane interakcje: Przełączanie między typami zasobów
- Obsługiwana walidacja: Sprawdzenie, czy zasoby są dostępne
- Typy: `ResourceGroupViewModel[]`
- Propsy: `resourceGroups`, `isTestRunning`

#### ResourceTypeGroup
- Opis komponentu: Grupowanie zasobów według typu (CSS, JS, ikony)
- Główne elementy: Nagłówek grupy, lista zasobów, podsumowanie czasu ładowania
- Obsługiwane interakcje: Brak (komponent informacyjny)
- Obsługiwana walidacja: Sprawdzenie, czy typ zasobu jest jednym z dostępnych
- Typy: `ResourceGroupViewModel`
- Propsy: `group`

### Strona z dynamicznym JS (/test/dynamic-js)

#### DynamicJSPage
- Opis komponentu: Główny komponent strony z dynamicznym JS
- Główne elementy: TestControls, PerformanceMetrics, DynamicJSDemo, ModuleLoadingVisualization
- Obsługiwane interakcje: Uruchamianie testów, interakcje z demo
- Obsługiwana walidacja: Sprawdzenie stanu testu przed rozpoczęciem/zatrzymaniem
- Typy: `DynamicJSPageViewModel`

#### DynamicJSDemo
- Opis komponentu: Interaktywne demo z dynamicznie ładowanym JS
- Główne elementy: Interaktywne elementy (przyciski, formularze, etc.)
- Obsługiwane interakcje: Kliknięcia, wprowadzanie danych, drag&drop
- Obsługiwana walidacja: Sprawdzenie, czy moduły JS są dostępne
- Typy: `JSModuleViewModel[]`
- Propsy: `modules`, `isTestRunning`, `onModuleLoad`

#### ModuleLoadingVisualization
- Opis komponentu: Wizualizacja procesu ładowania modułów JS
- Główne elementy: Graf zależności, wskaźniki postępu
- Obsługiwane interakcje: Hover dla szczegółów
- Obsługiwana walidacja: Sprawdzenie, czy moduł jest w trakcie ładowania/załadowany/błąd
- Typy: `JSModuleViewModel[]`
- Propsy: `modules`

### Raport szczegółowy (/reports/:id)

#### ReportPage
- Opis komponentu: Główny komponent strony raportu
- Główne elementy: MetricsCharts, ResourcesTable, RecommendationsPanel, ExportButton
- Obsługiwane interakcje: Przeglądanie danych, eksport, filtrowanie
- Obsługiwana walidacja: Sprawdzenie, czy dane raportu są dostępne
- Typy: `ReportPageViewModel`

#### MetricsCharts
- Opis komponentu: Interaktywne wykresy z metrykami wydajności
- Główne elementy: Wykresy dla każdej metryki, wykres porównawczy strategii
- Obsługiwane interakcje: Zoom, hover dla szczegółów
- Obsługiwana walidacja: Sprawdzenie, czy dane są dostępne
- Typy: `ChartDataViewModel[]`
- Propsy: `chartData`

#### ResourcesTable
- Opis komponentu: Tabela zasobów z filtrowaniem i sortowaniem
- Główne elementy: Tabela z paginacją, filtry, opcje sortowania
- Obsługiwane interakcje: Filtrowanie, sortowanie, paginacja
- Obsługiwana walidacja: Sprawdzenie, czy dane są dostępne
- Typy: `ResourceTableItemViewModel[]`
- Propsy: `resources`, `onFilter`, `onSort`, `onPageChange`

#### RecommendationsPanel
- Opis komponentu: Panel z rekomendacjami dotyczącymi optymalnej strategii
- Główne elementy: Sekcja najlepszej strategii, wyjaśnienie, porównanie
- Obsługiwane interakcje: Brak (komponent informacyjny)
- Obsługiwana walidacja: Sprawdzenie, czy rekomendacje są dostępne
- Typy: `RecommendationViewModel`
- Propsy: `recommendations`

#### ExportButton
- Opis komponentu: Przycisk eksportu danych (CSV/JSON)
- Główne elementy: Dropdown z formatami, przycisk eksportu
- Obsługiwane interakcje: Wybór formatu, kliknięcie eksportu
- Obsługiwana walidacja: Sprawdzenie, czy format jest obsługiwany
- Typy: `ExportFormat` (enum)
- Propsy: `resultId`, `onExport`, `isExporting`

## 5. Typy

```typescript
// Enum dla strategii cache'owania
export enum CachingStrategy {
  NETWORK_FIRST = "network-first",
  CACHE_FIRST = "cache-first",
  STALE_WHILE_REVALIDATE = "stale-while-revalidate",
  CACHE_THEN_NETWORK = "cache-then-network"
}

// Enum dla warunków sieciowych
export enum NetworkCondition {
  GOOD = "good",
  SLOW = "slow",
  FLAKY = "flaky",
  OFFLINE = "offline"
}

// Model dla wskaźników wydajności
export interface PerformanceMetricsViewModel {
  fp: number | null;
  fcp: number | null;
  tti: number | null;
  lcp: number | null;
  fid: number | null;
  ttfb: number | null;
  offlineAvailability: boolean;
  timestamp: Date;
}

// Model dla konfiguracji testu
export interface TestConfigViewModel {
  strategy: CachingStrategy;
  networkCondition: NetworkCondition;
  resourceSize: "small" | "medium" | "large";
}

// Model dla stanu testu
export interface TestStateViewModel {
  isRunning: boolean;
  startTime: Date | null;
  endTime: Date | null;
  elapsedTime: number;
}

// Model dla obrazu testowego
export interface TestImageViewModel {
  id: string;
  url: string;
  size: number; // w bajtach
  isLoading: boolean;
  isLoaded: boolean;
  loadTime: number | null;
  error: string | null;
}

// Model dla strony z dużymi obrazami
export interface LargeImagesPageViewModel {
  images: TestImageViewModel[];
  metrics: PerformanceMetricsViewModel;
  testConfig: TestConfigViewModel;
  testState: TestStateViewModel;
}

// Enum dla typów małych zasobów
export enum SmallResourceType {
  CSS = "css",
  JS = "js",
  ICON = "icon"
}

// Model dla małego zasobu
export interface SmallResourceViewModel {
  id: string;
  url: string;
  type: SmallResourceType;
  size: number; // w bajtach
  isLoading: boolean;
  isLoaded: boolean;
  loadTime: number | null;
  error: string | null;
}

// Model dla grupy zasobów
export interface ResourceGroupViewModel {
  type: SmallResourceType;
  resources: SmallResourceViewModel[];
  totalLoadTime: number | null;
  averageLoadTime: number | null;
}

// Model dla strony z małymi zasobami
export interface SmallResourcesPageViewModel {
  resourceGroups: ResourceGroupViewModel[];
  metrics: PerformanceMetricsViewModel;
  testConfig: TestConfigViewModel;
  testState: TestStateViewModel;
}

// Model dla modułu JS
export interface JSModuleViewModel {
  id: string;
  name: string;
  size: number; // w bajtach
  isLoading: boolean;
  isLoaded: boolean;
  loadStartTime: Date | null;
  loadEndTime: Date | null;
  loadTime: number | null;
  error: string | null;
  dependencies: string[]; // IDs innych modułów
}

// Model dla strony z dynamicznym JS
export interface DynamicJSPageViewModel {
  modules: JSModuleViewModel[];
  metrics: PerformanceMetricsViewModel;
  testConfig: TestConfigViewModel;
  testState: TestStateViewModel;
}

// Model dla danych wykresu
export interface ChartDataViewModel {
  metricName: string;
  strategies: CachingStrategy[];
  values: Record<CachingStrategy, number | null>;
  bestStrategy: CachingStrategy | null;
}

// Model dla zasobu w tabeli
export interface ResourceTableItemViewModel {
  id: string;
  url: string;
  type: string;
  size: number;
  loadTime: number;
  cacheHit: boolean;
  strategy: CachingStrategy;
}

// Model dla rekomendacji
export interface RecommendationViewModel {
  bestStrategy: CachingStrategy | null;
  metrics: Record<string, CachingStrategy>;
  explanation: string;
}

// Model dla strony raportu
export interface ReportPageViewModel {
  id: string;
  testSession: TestSessionResponseDTO;
  testResults: TestResultResponseDTO[];
  chartData: ChartDataViewModel[];
  resources: ResourceTableItemViewModel[];
  recommendations: RecommendationViewModel;
}
```

## 6. Zarządzanie stanem

### Globalne zarządzanie stanem

Aplikacja będzie wykorzystywać React Context API do zarządzania globalnym stanem:

```typescript
// AppContext.tsx
export interface AppState {
  currentStrategy: CachingStrategy;
  currentNetworkCondition: NetworkCondition;
  isOnline: boolean;
  cacheSize: number;
  currentTestSession: TestSessionResponseDTO | null;
  
  setStrategy: (strategy: CachingStrategy) => void;
  setNetworkCondition: (condition: NetworkCondition) => void;
  resetCache: () => Promise<void>;
  createTestSession: (name: string, description?: string) => Promise<string>;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC = ({ children }) => {
  // Implementacja stanu i funkcji
  // ...
  
  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```

### Hooki niestandardowe

#### usePerformanceMetrics

```typescript
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetricsViewModel>({
    fp: null,
    fcp: null,
    tti: null,
    lcp: null,
    fid: null,
    ttfb: null,
    offlineAvailability: navigator.onLine,
    timestamp: new Date()
  });
  
  const startMeasuring = () => {
    // Implementacja pomiaru metryk przy użyciu Performance API
    // ...
  };
  
  const stopMeasuring = () => {
    // Zatrzymanie pomiaru i zwrócenie wyników
    // ...
  };
  
  const resetMetrics = () => {
    // Reset metryk do wartości początkowych
    // ...
  };
  
  return { metrics, startMeasuring, stopMeasuring, resetMetrics };
};
```

#### useTestSession

```typescript
export const useTestSession = () => {
  const [session, setSession] = useState<TestSessionResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createSession = async (name: string, description?: string) => {
    setIsLoading(true);
    try {
      // Implementacja tworzenia sesji przez API
      // ...
      return sessionId;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Inne funkcje dla sesji
  // ...
  
  return { session, isLoading, error, createSession, /* ... */ };
};
```

#### useResourceLoading

```typescript
export const useResourceLoading = (type: 'image' | 'small' | 'js') => {
  const [resources, setResources] = useState<
    TestImageViewModel[] | SmallResourceViewModel[] | JSModuleViewModel[]
  >([]);
  
  const trackResource = (url: string, options?: any) => {
    // Śledzenie ładowania zasobu
    // ...
  };
  
  const saveResourceMetrics = async (resultId: string) => {
    // Zapisywanie metryk zasobów przez API
    // ...
  };
  
  // Inne funkcje dla śledzenia zasobów
  // ...
  
  return { resources, trackResource, saveResourceMetrics, /* ... */ };
};
```

## 7. Integracja API

### Tworzenie sesji testowej

```typescript
const createTestSession = async (name: string, description?: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/test-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description
      } as CreateTestSessionDTO),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating test session:', error);
    return null;
  }
};
```

### Zapisywanie wyników testu

```typescript
const saveTestResult = async (
  sessionId: string, 
  strategy: CachingStrategy, 
  metrics: PerformanceMetricsViewModel,
  rawMetrics?: any
): Promise<string | null> => {
  try {
    const response = await fetch('/api/test-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        strategy_type: strategy,
        fp: metrics.fp,
        fcp: metrics.fcp,
        tti: metrics.tti,
        lcp: metrics.lcp,
        fid: metrics.fid,
        ttfb: metrics.ttfb,
        offline_availability: metrics.offlineAvailability,
        raw_metrics: rawMetrics || null
      } as CreateTestResultDTO),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error saving test result:', error);
    return null;
  }
};
```

### Pobieranie szczegółów raportu

```typescript
const getTestResult = async (id: string): Promise<TestResultResponseDTO | null> => {
  try {
    const response = await fetch(`/api/test-results/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching test result:', error);
    return null;
  }
};
```

### Eksport wyników testu

```typescript
const exportTestResult = async (
  id: string, 
  format: 'csv' | 'json',
  includeResources: boolean = true
): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `/api/test-results/${id}/export?format=${format}&include_resources=${includeResources}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting test result:', error);
    return null;
  }
};
```

## 8. Interakcje użytkownika

### Wybór strategii cache'owania

1. Użytkownik klika dropdown w headerze
2. Wybiera jedną z czterech strategii
3. System zapisuje wybór w stanie aplikacji i localStorage
4. Wybrana strategia jest zastosowana przez Service Worker

### Wybór warunków sieciowych

1. Użytkownik klika dropdown w headerze
2. Wybiera jedne z czterech warunków sieciowych
3. System zapisuje wybór i konfiguruje symulację
4. Status wybranych warunków jest wyświetlany w UI

### Resetowanie cache'a

1. Użytkownik klika przycisk "Reset cache"
2. System wyświetla dialog potwierdzenia
3. Po potwierdzeniu, cache jest czyszczony
4. System wyświetla potwierdzenie sukcesu

### Uruchamianie testu

1. Użytkownik wybiera stronę testową (duże obrazy, małe zasoby, dynamiczny JS)
2. Klika przycisk "Rozpocznij test"
3. Opcjonalnie wybiera preset konfiguracji testu
4. Test rozpoczyna się, zasoby są ładowane, timer odlicza czas
5. System mierzy i wyświetla wskaźniki wydajności

### Zatrzymywanie testu

1. Użytkownik klika przycisk "Zatrzymaj test"
2. System zatrzymuje ładowanie zasobów i timer
3. Finalne wyniki są zapisywane i wyświetlane
4. System umożliwia utworzenie raportu lub restart testu

### Generowanie raportu

1. Użytkownik klika przycisk "Generuj raport"
2. System przekierowuje do strony raportu
3. Szczegółowe wyniki są prezentowane w formie wykresów i tabel
4. Użytkownik może eksportować dane w wybranym formacie

### Przeglądanie raportu

1. Użytkownik może przełączać się między zakładkami raportu
2. Może sortować i filtrować tabelę zasobów
3. Może powiększać wykresy dla lepszej analizy
4. Może eksportować dane do CSV lub JSON

## 9. Warunki i walidacja

### StrategySelector

- Walidacja: Wybrana strategia musi być jedną z czterech zdefiniowanych w `CachingStrategy`
- Wpływ: Niedostępne strategie są wyszarzone i nie można ich wybrać
- Komunikat: "Strategia niedostępna w bieżącej konfiguracji"

### NetworkConditionSelector

- Walidacja: Wybrane warunki muszą być jednym z czterech zdefiniowanych w `NetworkCondition`
- Wpływ: Niedostępne warunki są wyszarzone i nie można ich wybrać
- Komunikat: "Te warunki sieciowe nie mogą być obecnie zasymulowane"

### TestControls

- Walidacja: Test nie może być uruchomiony, gdy inny test jest w trakcie
- Wpływ: Przycisk startu jest wyszarzony, gdy test jest w trakcie
- Komunikat: "Zatrzymaj bieżący test przed rozpoczęciem nowego"

### ResourcesTable

- Walidacja: Dane muszą być dostępne przed renderowaniem tabeli
- Wpływ: Wyświetlany jest wskaźnik ładowania, gdy dane są pobierane
- Komunikat: "Ładowanie danych zasobów..."

### ExportButton

- Walidacja: Format eksportu musi być jednym z obsługiwanych (CSV, JSON)
- Wpływ: Nieobsługiwane formaty są wyszarzone i nie można ich wybrać
- Komunikat: "Format eksportu nieobsługiwany"

## 10. Obsługa błędów

### Błędy ogólne

- Brak połączenia z internetem:
  - Wyświetlenie banera informującego o trybie offline
  - Pokazanie ostatnich zapisanych wyników, jeśli są dostępne
  - Automatyczne ponowienie połączenia, gdy sieć powróci

- Błąd uwierzytelnienia:
  - Przekierowanie do strony logowania
  - Zachowanie danych sesji w localStorage
  - Automatyczne przywrócenie sesji po udanym logowaniu

- Błąd serwera:
  - Wyświetlenie komunikatu o błędzie
  - Przycisk ponowienia akcji
  - Logowanie błędu do systemu monitorowania

### Błędy specyficzne dla stron testowych

- Błąd ładowania zasobów:
  - Oznaczenie zasobu ikoną błędu
  - Kontynuacja testu z pozostałymi zasobami
  - Możliwość pominięcia nieudanych zasobów

- Błąd pomiaru wskaźników wydajności:
  - Oznaczenie metryki jako "N/A"
  - Kontynuacja pomiaru pozostałych metryk
  - Informacja o braku danych dla danej metryki

- Błąd symulacji warunków sieciowych:
  - Automatyczny powrót do standardowych warunków
  - Wyświetlenie komunikatu o błędzie symulacji
  - Opcja ręcznego ponowienia symulacji

### Błędy specyficzne dla raportu

- Błąd pobierania danych raportu:
  - Wyświetlenie częściowych danych, jeśli są dostępne
  - Przycisk ponowienia pobierania
  - Informacja o niekompletności danych

- Błąd generowania wykresu:
  - Wyświetlenie danych w formie tabelarycznej
  - Przycisk ponownego wygenerowania wykresu
  - Alternatywny sposób wizualizacji danych

- Błąd eksportu danych:
  - Wyświetlenie szczegółów błędu
  - Opcja eksportu w alternatywnym formacie
  - Przycisk ponowienia eksportu

## 11. Kroki implementacji

### 1. Konfiguracja projektu i routing

1. Utworzenie plików stron w strukturze Astro:
   - `src/pages/test/large-images.astro`
   - `src/pages/test/small-resources.astro`
   - `src/pages/test/dynamic-js.astro`
   - `src/pages/reports/[id].astro`

2. Implementacja podstawowej struktury layoutu:
   - Nagłówek z kontrolkami globalnymi
   - Menu boczne z nawigacją
   - Obszar zawartości

### 2. Implementacja komponentów współdzielonych

1. Utworzenie komponentów kontrolek:
   - `src/components/StrategySelector.tsx`
   - `src/components/NetworkConditionSelector.tsx`
   - `src/components/ResetCacheButton.tsx`
   - `src/components/TestControls.tsx`
   - `src/components/PerformanceMetrics.tsx`

2. Implementacja kontekstu aplikacji:
   - `src/lib/context/AppContext.tsx`

3. Implementacja hooków niestandardowych:
   - `src/lib/hooks/usePerformanceMetrics.ts`
   - `src/lib/hooks/useTestSession.ts`
   - `src/lib/hooks/useResourceLoading.ts`

### 3. Implementacja service workera

1. Utworzenie pliku service workera:
   - `public/sw.js`

2. Implementacja strategii cache'owania:
   - Network-first
   - Cache-first
   - Stale-while-revalidate
   - Cache-then-network

3. Implementacja zarządzania cache'm:
   - Resetowanie cache'a
   - Mierzenie rozmiaru cache'a

### 4. Implementacja stron testowych

1. Implementacja strony z dużymi obrazami:
   - `src/components/LargeImagesGrid.tsx`
   - `src/components/ImagePerformanceIndicator.tsx`

2. Implementacja strony z małymi zasobami:
   - `src/components/SmallResourcesGrid.tsx`
   - `src/components/ResourceTypeGroup.tsx`

3. Implementacja strony z dynamicznym JS:
   - `src/components/DynamicJSDemo.tsx`
   - `src/components/ModuleLoadingVisualization.tsx`

### 5. Implementacja strony raportu

1. Implementacja komponentów raportu:
   - `src/components/MetricsCharts.tsx`
   - `src/components/ResourcesTable.tsx`
   - `src/components/RecommendationsPanel.tsx`
   - `src/components/ExportButton.tsx`

2. Implementacja logiki raportu:
   - Pobieranie danych testu
   - Generowanie wykresów
   - Sortowanie i filtrowanie zasobów
   - Eksport danych

### 6. Implementacja integracji API

1. Implementacja klientów API:
   - `src/lib/api/testSessions.ts`
   - `src/lib/api/testResults.ts`
   - `src/lib/api/resources.ts`

2. Implementacja obsługi błędów:
   - Globalna obsługa błędów HTTP
   - Komponent powiadomień o błędach

### 7. Integracja i testowanie

1. Testowanie każdej strony:
   - Poprawność renderowania komponentów
   - Obsługa interakcji użytkownika
   - Integracja z API

2. Testowanie service workera:
   - Działanie strategii cache'owania
   - Obsługa trybu offline
   - Resetowanie cache'a

3. Testowanie pomiarów wydajności:
   - Dokładność metryk
   - Rejestracja metryk dla zasobów
   - Generowanie raportów 