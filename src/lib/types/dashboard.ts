import type { TestResultMetricsDTO } from "../../types";

/**
 * Model danych dla karty wyniku testu
 */
export interface TestResultCardViewModel {
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
  performanceIndicator: "good" | "medium" | "poor";
}

/**
 * Model danych dla skróconego raportu
 */
export interface MiniReportViewModel {
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
  performanceIndicator: "good" | "medium" | "poor";
}

/**
 * Model danych dla wykresu porównującego strategie
 */
export interface StrategyComparisonViewModel {
  strategies: string[];
  metrics: Record<string, number[]>;
  bestStrategy: string;
  bestMetrics: Record<string, string>;
}

/**
 * Model danych dla sesji testowej
 */
export interface RecentTestSessionViewModel {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  duration: string | null;
  testCount?: number;
  status: "success" | "failed" | "pending" | "unknown";
}

/**
 * Model danych dla informacji o strategii cache'owania
 */
export interface CachingStrategyInfoViewModel {
  name: string;
  description: string;
  useCase: string;
  learnMoreUrl: string;
}

/**
 * Funkcja obliczająca wskaźnik wydajności na podstawie metryk
 */
export function calculatePerformanceIndicator(
  metrics: TestResultMetricsDTO,
): "good" | "medium" | "poor" {
  // Progi dla poszczególnych metryk
  const thresholds = {
    fp: { good: 1000, medium: 2000 }, // milliseconds
    fcp: { good: 1800, medium: 3000 }, // milliseconds
    tti: { good: 3800, medium: 7300 }, // milliseconds
    lcp: { good: 2500, medium: 4000 }, // milliseconds
    fid: { good: 100, medium: 300 }, // milliseconds
    ttfb: { good: 800, medium: 1800 }, // milliseconds
  };

  // Obliczanie oceny dla każdej metryki
  let scores = 0;
  let metricsCount = 0;

  for (const [key, value] of Object.entries(metrics)) {
    if (value !== undefined && value !== null && key in thresholds) {
      const threshold = thresholds[key as keyof typeof thresholds];
      if (typeof value === "number" && value <= threshold.good) {
        scores += 3; // good
      } else if (typeof value === "number" && value <= threshold.medium) {
        scores += 2; // medium
      } else {
        scores += 1; // poor
      }
      metricsCount++;
    }
  }

  // Obliczanie średniego wyniku
  if (metricsCount === 0) return "medium"; // Domyślnie medium, jeśli brak metryk

  const averageScore = scores / metricsCount;

  if (averageScore >= 2.5) return "good";
  if (averageScore >= 1.5) return "medium";
  return "poor";
}

/**
 * Funkcja formatująca wartość metryki do wyświetlenia
 */
export function formatMetricValue(
  key: string,
  value: number | null | undefined,
): string {
  if (value === undefined || value === null) return "N/A";

  switch (key) {
    case "fp":
    case "fcp":
    case "tti":
    case "lcp":
    case "fid":
    case "ttfb":
      return `${value.toFixed(0)} ms`;
    case "offline_availability":
      return value ? "Tak" : "Nie";
    default:
      return `${value}`;
  }
}

/**
 * Funkcja tłumacząca nazwę metryki na czytelną etykietę
 */
export function getMetricLabel(key: string): string {
  const labels: Record<string, string> = {
    fp: "First Paint",
    fcp: "First Contentful Paint",
    tti: "Time to Interactive",
    lcp: "Largest Contentful Paint",
    fid: "First Input Delay",
    ttfb: "Time to First Byte",
    offline_availability: "Dostępność offline",
  };

  return labels[key] || key;
}
