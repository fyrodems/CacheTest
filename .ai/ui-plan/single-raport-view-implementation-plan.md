# Plan implementacji widoku Raport Szczegółowy

## 1. Przegląd
Widok "Raport Szczegółowy" prezentuje kompletne informacje o przeprowadzonym teście strategii cache'owania. Zawiera szczegółowe metryki wydajności, listę załadowanych zasobów, informacje o środowisku testowym, porównanie z innymi strategiami oraz rekomendacje. Umożliwia dogłębną analizę wyników i eksport danych w wybranych formatach. Widok ten jest kluczowy dla procesu analizy i oceny różnych strategii cache'owania w kontekście wymagań aplikacji PWA.

## 2. Routing widoku
- **Ścieżka**: `/reports/:id`
- **Parametry**:
  - `id` (UUID): Identyfikator wyniku testu

## 3. Struktura komponentów
```
ReportView
├── ReportHeader
│   ├── ReportTitle
│   ├── TestInfoSummary
│   └── ExportButton
├── TabPanel
│   ├── MetricsTab
│   │   ├── MetricsOverview
│   │   └── DetailedMetricsCharts
│   ├── ResourcesTab
│   │   └── ResourcesTable
│   ├── EnvironmentTab
│   │   └── EnvironmentInfoCard
│   └── ComparisonTab
│       ├── StrategyComparisonChart
│       └── MetricsComparisonTable
├── RecommendationPanel
└── PresentationModeButton
```

## 4. Szczegóły komponentów

### ReportView
- **Opis komponentu**: Główny kontener widoku raportu, zarządza stanem i pobieraniem danych.
- **Główne elementy**: Kontener okalający wszystkie komponenty widoku, obsługuje stany ładowania i błędów.
- **Obsługiwane interakcje**: Inicjalizacja pobierania danych po załadowaniu.
- **Obsługiwana walidacja**: Sprawdzanie poprawności ID raportu (UUID).
- **Typy**: TestResultResponseDTO, ResourceMetricResponseDTO, EnvironmentInfoResponseDTO, TestResultComparisonResponseDTO.
- **Propsy**: id: string - identyfikator wyniku testu.

### ReportHeader
- **Opis komponentu**: Górna część widoku zawierająca tytuł, podstawowe informacje i przycisk eksportu.
- **Główne elementy**: Tytuł raportu, podsumowanie strategii i daty testu, przycisk eksportu.
- **Obsługiwane interakcje**: Kliknięcie przycisku eksportu.
- **Obsługiwana walidacja**: Brak.
- **Typy**: TestResultResponseDTO (częściowo).
- **Propsy**: 
  - testResult: Partial<TestResultResponseDTO>
  - onExport: (format: ExportFormat) => void

### TabPanel
- **Opis komponentu**: Panel z zakładkami do przełączania między różnymi sekcjami raportu.
- **Główne elementy**: Przyciski zakładek, kontener na zawartość zakładki.
- **Obsługiwane interakcje**: Przełączanie między zakładkami.
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych.
- **Propsy**: 
  - activeTab: string
  - onTabChange: (tab: string) => void
  - children: ReactNode[]

### MetricsTab
- **Opis komponentu**: Zakładka prezentująca szczegółowe metryki wydajności.
- **Główne elementy**: Podsumowanie metryk, interaktywne wykresy.
- **Obsługiwane interakcje**: Interakcje z wykresami (zoom, hover).
- **Obsługiwana walidacja**: Brak.
- **Typy**: TestResultMetricsDTO.
- **Propsy**: metrics: TestResultMetricsDTO, rawMetrics?: any

### ResourcesTab
- **Opis komponentu**: Zakładka prezentująca zasoby załadowane podczas testu.
- **Główne elementy**: Tabela zasobów z filtrowaniem, sortowaniem i paginacją.
- **Obsługiwane interakcje**: Filtrowanie, sortowanie, zmiana strony.
- **Obsługiwana walidacja**: Brak.
- **Typy**: ResourceMetricResponseDTO, ResourceMetricListResponseDTO.
- **Propsy**: resourceMetrics: ResourceMetricListResponseDTO

### EnvironmentTab
- **Opis komponentu**: Zakładka prezentująca informacje o środowisku testowym.
- **Główne elementy**: Karty informacyjne o przeglądarce, systemie, urządzeniu.
- **Obsługiwane interakcje**: Brak specyficznych.
- **Obsługiwana walidacja**: Brak.
- **Typy**: EnvironmentInfoResponseDTO.
- **Propsy**: environmentInfo: EnvironmentInfoResponseDTO

### ComparisonTab
- **Opis komponentu**: Zakładka porównująca wyniki testu z innymi strategiami.
- **Główne elementy**: Wykres porównawczy, tabela z porównaniem metryk.
- **Obsługiwane interakcje**: Interakcje z wykresem, filtrowanie porównania.
- **Obsługiwana walidacja**: Brak.
- **Typy**: TestResultComparisonResponseDTO.
- **Propsy**: comparisonData: TestResultComparisonResponseDTO

### RecommendationPanel
- **Opis komponentu**: Panel prezentujący rekomendacje dotyczące wyboru optymalnej strategii.
- **Główne elementy**: Rekomendowana strategia, uzasadnienie, porównanie.
- **Obsługiwane interakcje**: Brak specyficznych.
- **Obsługiwana walidacja**: Brak.
- **Typy**: TestResultComparisonResponseDTO (częściowo).
- **Propsy**: 
  - bestStrategy: string
  - comparisonData: Partial<TestResultComparisonResponseDTO>

### PresentationModeButton
- **Opis komponentu**: Przycisk umożliwiający przejście do trybu prezentacyjnego.
- **Główne elementy**: Przycisk z ikoną.
- **Obsługiwane interakcje**: Kliknięcie (przekierowanie do trybu prezentacyjnego).
- **Obsługiwana walidacja**: Brak.
- **Typy**: Brak specyficznych.
- **Propsy**: reportId: string

### DetailedMetricsCharts
- **Opis komponentu**: Zestaw interaktywnych wykresów dla poszczególnych metryk.
- **Główne elementy**: Wykresy liniowe/słupkowe z danymi metryk.
- **Obsługiwane interakcje**: Zoom, hover dla szczegółów, zmiana typu wykresu.
- **Obsługiwana walidacja**: Brak.
- **Typy**: TestResultMetricsDTO.
- **Propsy**: metrics: TestResultMetricsDTO, rawMetrics?: any

### ResourcesTable
- **Opis komponentu**: Tabela prezentująca zasoby załadowane podczas testu.
- **Główne elementy**: Tabela z kolumnami: URL, typ, rozmiar, czas ładowania, cache hit.
- **Obsługiwane interakcje**: Sortowanie po kolumnach, filtrowanie, paginacja.
- **Obsługiwana walidacja**: Brak.
- **Typy**: ResourceMetricResponseDTO.
- **Propsy**: 
  - resources: ResourceMetricResponseDTO[]
  - pagination: PaginationResponseDTO
  - onPageChange: (page: number) => void
  - onFilterChange: (filters: ResourceFilters) => void
  - onSortChange: (sort: SortParams) => void

### StrategyComparisonChart
- **Opis komponentu**: Wykres radarowy/słupkowy porównujący metryki dla różnych strategii.
- **Główne elementy**: Interaktywny wykres z legendą.
- **Obsługiwane interakcje**: Hover dla szczegółów, włączanie/wyłączanie serii danych.
- **Obsługiwana walidacja**: Brak.
- **Typy**: TestResultComparisonResponseDTO.
- **Propsy**: comparisonData: TestResultComparisonResponseDTO

## 5. Typy

### ViewModels (specyficzne dla UI)
```typescript
// Typy filtrów dla tabeli zasobów
interface ResourceFilters {
  resourceType?: string;
  mimeType?: string;
  cacheHit?: boolean;
  minSize?: number;
  maxSize?: number;
  minLoadTime?: number;
  maxLoadTime?: number;
}

// Parametry sortowania
interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// Parametry paginacji używane wewnętrznie w komponentach
interface PaginationParams {
  page: number;
  limit: number;
}

// Rozszerzony model wyniku testu z dodatkowymi danymi UI
interface ReportViewModel {
  testResult: TestResultResponseDTO;
  resources: ResourceMetricListResponseDTO;
  environment: EnvironmentInfoResponseDTO;
  comparison: TestResultComparisonResponseDTO;
  loading: {
    testResult: boolean;
    resources: boolean;
    environment: boolean;
    comparison: boolean;
  };
  error: {
    testResult?: string;
    resources?: string;
    environment?: string;
    comparison?: string;
  };
}

// Model dla wykresu porównawczego strategii
interface StrategyComparisonChartData {
  strategies: string[];
  metrics: {
    [metricName: string]: {
      [strategy: string]: number;
    }
  };
  colors: {
    [strategy: string]: string;
  };
}

// Typ dla opcji eksportu
type ExportFormat = 'csv' | 'json';

// Konfiguracja wykresu
interface ChartConfig {
  type: 'bar' | 'line' | 'radar' | 'pie';
  showLegend: boolean;
  enableZoom: boolean;
  enableTooltip: boolean;
  height: number;
}
```

## 6. Zarządzanie stanem

### Główny stan widoku
Główny stan widoku będzie zarządzany przez customowy hook `useReportView`, który będzie odpowiedzialny za:
- Pobieranie danych o wyniku testu
- Pobieranie zasobów powiązanych z testem
- Pobieranie informacji o środowisku
- Pobieranie danych porównawczych
- Obsługę eksportu danych
- Przechowywanie aktywnej zakładki
- Zarządzanie filtrami, sortowaniem i paginacją dla tabeli zasobów

```typescript
function useReportView(reportId: string) {
  // Pobieranie danych podstawowych
  const [testResult, setTestResult] = useState<TestResultResponseDTO | null>(null);
  const [isLoadingTestResult, setIsLoadingTestResult] = useState(true);
  const [testResultError, setTestResultError] = useState<string | null>(null);
  
  // Pobieranie zasobów
  const [resources, setResources] = useState<ResourceMetricListResponseDTO | null>(null);
  const [resourceFilters, setResourceFilters] = useState<ResourceFilters>({});
  const [resourceSort, setResourceSort] = useState<SortParams>({ field: 'load_time', order: 'desc' });
  const [resourcePagination, setResourcePagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  
  // Pobieranie informacji o środowisku
  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfoResponseDTO | null>(null);
  const [isLoadingEnvironment, setIsLoadingEnvironment] = useState(true);
  const [environmentError, setEnvironmentError] = useState<string | null>(null);
  
  // Pobieranie danych porównawczych
  const [comparisonData, setComparisonData] = useState<TestResultComparisonResponseDTO | null>(null);
  const [isLoadingComparison, setIsLoadingComparison] = useState(true);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  
  // Zarządzanie zakładkami
  const [activeTab, setActiveTab] = useState('metrics');
  
  // Funkcje pomocnicze
  const fetchTestResult = useCallback(async () => { /* implementacja */ }, [reportId]);
  const fetchResources = useCallback(async () => { /* implementacja */ }, [reportId, resourceFilters, resourceSort, resourcePagination]);
  const fetchEnvironmentInfo = useCallback(async () => { /* implementacja */ }, [reportId]);
  const fetchComparisonData = useCallback(async () => { /* implementacja */ }, [reportId]);
  const exportReport = useCallback(async (format: ExportFormat) => { /* implementacja */ }, [reportId]);
  
  // Efekty do pobierania danych
  useEffect(() => { fetchTestResult(); }, [fetchTestResult]);
  useEffect(() => { fetchResources(); }, [fetchResources]);
  useEffect(() => { fetchEnvironmentInfo(); }, [fetchEnvironmentInfo]);
  useEffect(() => { fetchComparisonData(); }, [fetchComparisonData]);
  
  // Zwracanie stanu i funkcji
  return {
    testResult,
    resources,
    environmentInfo,
    comparisonData,
    loading: {
      testResult: isLoadingTestResult,
      resources: isLoadingResources,
      environment: isLoadingEnvironment,
      comparison: isLoadingComparison
    },
    error: {
      testResult: testResultError,
      resources: resourcesError,
      environment: environmentError,
      comparison: comparisonError
    },
    activeTab,
    setActiveTab,
    resourceFilters,
    setResourceFilters,
    resourceSort,
    setResourceSort,
    resourcePagination,
    setResourcePagination,
    exportReport
  };
}
```

## 7. Integracja API

### Pobieranie wyniku testu
```typescript
const fetchTestResult = async (id: string): Promise<TestResultResponseDTO> => {
  try {
    const response = await fetch(`/api/test-results/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Nie znaleziono wyników testu.');
      } else if (response.status === 401) {
        throw new Error('Brak autoryzacji do przeglądania tego wyniku.');
      } else if (response.status === 403) {
        throw new Error('Brak dostępu do tego wyniku testu.');
      } else {
        throw new Error('Wystąpił błąd podczas pobierania wyniku testu.');
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching test result:', error);
    throw error;
  }
};
```

### Pobieranie zasobów
```typescript
const fetchResources = async (
  resultId: string, 
  filters: ResourceFilters, 
  sort: SortParams, 
  pagination: PaginationParams
): Promise<ResourceMetricListResponseDTO> => {
  try {
    const searchParams = new URLSearchParams();
    
    // Dodanie parametrów filtrowania
    if (filters.resourceType) searchParams.append('resource_type', filters.resourceType);
    if (filters.cacheHit !== undefined) searchParams.append('cache_hit', filters.cacheHit.toString());
    // ... pozostałe filtry
    
    // Dodanie parametrów sortowania i paginacji
    searchParams.append('sort', sort.field);
    searchParams.append('order', sort.order);
    searchParams.append('page', pagination.page.toString());
    searchParams.append('limit', pagination.limit.toString());
    
    const response = await fetch(`/api/test-results/${resultId}/resources?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas pobierania zasobów.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};
```

### Pobieranie informacji o środowisku
```typescript
const fetchEnvironmentInfo = async (sessionId: string): Promise<EnvironmentInfoResponseDTO> => {
  try {
    const response = await fetch(`/api/test-sessions/${sessionId}/environment`);
    
    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas pobierania informacji o środowisku.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching environment info:', error);
    throw error;
  }
};
```

### Pobieranie danych porównawczych
```typescript
const fetchComparisonData = async (resultIds: string[]): Promise<TestResultComparisonResponseDTO> => {
  try {
    const response = await fetch(`/api/test-results/compare?ids=${resultIds.join(',')}`);
    
    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas pobierania danych porównawczych.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    throw error;
  }
};
```

### Eksport raportu
```typescript
const exportReport = async (resultId: string, format: ExportFormat, includeResources: boolean = true): Promise<Blob> => {
  try {
    const response = await fetch(`/api/test-results/${resultId}/export?format=${format}&include_resources=${includeResources}`);
    
    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas eksportu raportu.');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
};
```

## 8. Interakcje użytkownika

### Przełączanie zakładek
- **Interakcja**: Kliknięcie na zakładkę w komponencie TabPanel.
- **Obsługa**: 
  ```typescript
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  ```

### Filtrowanie zasobów
- **Interakcja**: Wprowadzenie kryteriów filtrowania w ResourcesTab.
- **Obsługa**: 
  ```typescript
  const handleFilterChange = (filters: ResourceFilters) => {
    setResourceFilters(filters);
    setResourcePagination({ ...resourcePagination, page: 1 }); // Reset strony przy zmianie filtrów
  };
  ```

### Sortowanie zasobów
- **Interakcja**: Kliknięcie nagłówka kolumny w tabeli zasobów.
- **Obsługa**: 
  ```typescript
  const handleSortChange = (field: string) => {
    if (resourceSort.field === field) {
      // Zmiana kierunku sortowania, jeśli to samo pole
      setResourceSort({
        field,
        order: resourceSort.order === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Nowe pole sortowania, domyślnie malejąco
      setResourceSort({ field, order: 'desc' });
    }
  };
  ```

### Zmiana strony w tabeli zasobów
- **Interakcja**: Kliknięcie przycisku paginacji.
- **Obsługa**: 
  ```typescript
  const handlePageChange = (page: number) => {
    setResourcePagination({ ...resourcePagination, page });
  };
  ```

### Eksport raportu
- **Interakcja**: Kliknięcie przycisku eksportu i wybór formatu.
- **Obsługa**: 
  ```typescript
  const handleExport = async (format: ExportFormat) => {
    try {
      const blob = await exportReport(reportId, format);
      
      // Utworzenie linku do pobrania
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      // Obsługa błędu
      toast.error('Wystąpił błąd podczas eksportu raportu');
    }
  };
  ```

### Przejście do trybu prezentacyjnego
- **Interakcja**: Kliknięcie przycisku trybu prezentacyjnego.
- **Obsługa**: 
  ```typescript
  const handlePresentationMode = () => {
    router.push(`/presentation/${reportId}`);
  };
  ```

### Interakcja z wykresami
- **Interakcja**: Hover, zoom, włączanie/wyłączanie serii danych.
- **Obsługa**: Implementacja zależy od wybranej biblioteki wykresów (np. Recharts, Chart.js).

## 9. Warunki i walidacja

### Walidacja ID raportu
- **Warunek**: ID musi być poprawnym UUID.
- **Komponent**: ReportView.
- **Implementacja**:
  ```typescript
  const isValidUUID = (id: string) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
  };
  
  useEffect(() => {
    if (!isValidUUID(reportId)) {
      setTestResultError('Nieprawidłowy format ID raportu.');
      return;
    }
    
    fetchTestResult();
  }, [reportId]);
  ```

### Walidacja dostępu do danych
- **Warunek**: Użytkownik może przeglądać tylko swoje raporty.
- **Komponent**: ReportView.
- **Implementacja**: Obsługa błędów 401/403 z API.

### Walidacja dostępności danych
- **Warunek**: Dane muszą być dostępne do wyświetlenia.
- **Komponenty**: Wszystkie komponenty prezentujące dane.
- **Implementacja**: Wyświetlanie stanów ładowania i komunikatów o braku danych.

## 10. Obsługa błędów

### Błędy pobierania danych
- **Scenariusz**: Błąd podczas pobierania danych z API.
- **Obsługa**: 
  ```typescript
  try {
    const data = await fetchTestResult(reportId);
    setTestResult(data);
  } catch (error) {
    setTestResultError(error instanceof Error ? error.message : 'Nieznany błąd');
    toast.error('Nie udało się pobrać wyników testu');
  } finally {
    setIsLoadingTestResult(false);
  }
  ```

### Brak dostępu
- **Scenariusz**: Użytkownik próbuje uzyskać dostęp do raportu innego użytkownika.
- **Obsługa**: Przekierowanie do strony z komunikatem o braku dostępu.

### Brak danych
- **Scenariusz**: Brak wyników lub zasobów do wyświetlenia.
- **Obsługa**: Wyświetlenie komunikatu o braku danych.
  ```tsx
  {!isLoading && !testResult && !error && (
    <EmptyState 
      title="Brak danych" 
      description="Nie znaleziono wyników dla tego testu." 
      icon={<DatabaseIcon className="h-12 w-12" />} 
    />
  )}
  ```

### Błędy podczas eksportu
- **Scenariusz**: Błąd podczas eksportu raportu.
- **Obsługa**: Wyświetlenie powiadomienia o błędzie.

### Obsługa stanów ładowania
- **Scenariusz**: Dane są w trakcie pobierania.
- **Obsługa**: Wyświetlenie komponentu ładowania.
  ```tsx
  {isLoading && <LoadingSpinner size="large" />}
  ```

## 11. Kroki implementacji

1. **Przygotowanie struktury plików**:
   - Utworzenie pliku głównego komponentu `ReportView.tsx`
   - Utworzenie plików dla podkomponentów w folderze `components/report/`
   - Przygotowanie hooka `useReportView.ts` w folderze `hooks/`

2. **Implementacja głównej struktury widoku**:
   - Komponent `ReportView` z obsługą routingu i podstawowym layoutem
   - System zakładek z komponentem `TabPanel`
   - Stany ładowania i obsługa błędów

3. **Implementacja pobierania danych**:
   - Hook `useReportView` z funkcjami do pobierania danych z API
   - Obsługa ładowania asynchronicznego i błędów

4. **Implementacja komponentów zakładek**:
   - `MetricsTab` z wykresami i tabelami metryk
   - `ResourcesTab` z tabelą zasobów i filtrowaniem
   - `EnvironmentTab` z informacjami o środowisku
   - `ComparisonTab` z porównaniem strategii

5. **Implementacja wizualizacji danych**:
   - Konfiguracja biblioteki wykresów (np. Recharts)
   - Implementacja komponentów wykresów dla różnych metryk
   - Interaktywne elementy wykresów (zoom, hover)

6. **Implementacja tabeli zasobów**:
   - Komponent `ResourcesTable` z sortowaniem, filtrowaniem i paginacją
   - Obsługa dużych zestawów danych

7. **Implementacja funkcji eksportu**:
   - Dodanie przycisku eksportu z wyborem formatu
   - Implementacja pobierania i zapisywania pliku

8. **Implementacja trybu prezentacyjnego**:
   - Przycisk przejścia do trybu prezentacyjnego
   - Obsługa przekierowania

9. **Refaktoryzacja i optymalizacja**:
   - Wydzielenie wspólnych komponentów
   - Optymalizacja renderowania (React.memo, useMemo, useCallback)
   - Lazy loading dla cięższych komponentów

10. **Testowanie**:
    - Testy jednostkowe dla kluczowych komponentów
    - Testy integracyjne dla przepływów danych
    - Testy użyteczności

11. **Ostateczne szlify**:
    - Dodanie animacji przejść
    - Dopracowanie stylów i responsywności
    - Dodanie skrótów klawiszowych 