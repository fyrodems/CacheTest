/**
 * Enum dla strategii cache'owania
 */
export enum CachingStrategy {
  NETWORK_FIRST = "network-first",
  CACHE_FIRST = "cache-first",
  STALE_WHILE_REVALIDATE = "stale-while-revalidate",
  CACHE_THEN_NETWORK = "cache-then-network",
}

/**
 * Enum dla warunków sieciowych
 */
export enum NetworkCondition {
  GOOD = "good",
  SLOW = "slow",
  FLAKY = "flaky",
  OFFLINE = "offline",
}

/**
 * Model dla wskaźników wydajności
 */
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

/**
 * Model dla konfiguracji testu
 */
export interface TestConfigViewModel {
  strategy: CachingStrategy;
  networkCondition: NetworkCondition;
  resourceSize: "small" | "medium" | "large";
}

/**
 * Model dla stanu testu
 */
export interface TestStateViewModel {
  isRunning: boolean;
  startTime: Date | null;
  endTime: Date | null;
  elapsedTime: number;
}

/**
 * Model dla obrazu testowego
 */
export interface TestImageViewModel {
  id: string;
  url: string;
  size: number; // w bajtach
  isLoading: boolean;
  isLoaded: boolean;
  loadTime: number | null;
  error: string | null;
}

/**
 * Enum dla typów małych zasobów
 */
export enum SmallResourceType {
  CSS = "css",
  JS = "js",
  ICON = "icon",
}

/**
 * Model dla małego zasobu
 */
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

/**
 * Model dla grupy zasobów
 */
export interface ResourceGroupViewModel {
  type: SmallResourceType;
  resources: SmallResourceViewModel[];
  totalLoadTime: number | null;
  averageLoadTime: number | null;
}

/**
 * Model dla modułu JS
 */
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

/**
 * Model dla danych wykresu
 */
export interface ChartDataViewModel {
  metricName: string;
  strategies: CachingStrategy[];
  values: Record<CachingStrategy, number | null>;
  bestStrategy: CachingStrategy | null;
}

/**
 * Model dla zasobu w tabeli
 */
export interface ResourceTableItemViewModel {
  id: string;
  url: string;
  type: string;
  size: number;
  loadTime: number;
  cacheHit: boolean;
  strategy: CachingStrategy;
}

/**
 * Model dla rekomendacji
 */
export interface RecommendationViewModel {
  bestStrategy: CachingStrategy | null;
  metrics: Record<string, CachingStrategy>;
  explanation: string;
}
