import { useState, useEffect, useCallback } from "react";
import type {
  TestResultCardViewModel,
  RecentTestSessionViewModel,
  StrategyComparisonViewModel,
} from "../types/dashboard";
import { calculatePerformanceIndicator } from "../types/dashboard";
import type {
  TestResultListResponseDTO,
  TestSessionListResponseDTO,
  TestResultComparisonResponseDTO,
  CacheResetResponseDTO,
} from "../../types";

export function useDashboardData() {
  // Stan dla wyników testów
  const [testResults, setTestResults] = useState<TestResultCardViewModel[]>([]);
  const [isLoadingTestResults, setIsLoadingTestResults] =
    useState<boolean>(true);
  const [errorTestResults, setErrorTestResults] = useState<Error | null>(null);

  // Stan dla sesji testowych
  const [testSessions, setTestSessions] = useState<
    RecentTestSessionViewModel[]
  >([]);
  const [isLoadingTestSessions, setIsLoadingTestSessions] =
    useState<boolean>(true);
  const [errorTestSessions, setErrorTestSessions] = useState<Error | null>(
    null,
  );

  // Stan dla porównania strategii
  const [strategyComparison, setStrategyComparison] =
    useState<StrategyComparisonViewModel | null>(null);
  const [isLoadingStrategyComparison, setIsLoadingStrategyComparison] =
    useState<boolean>(true);
  const [errorStrategyComparison, setErrorStrategyComparison] =
    useState<Error | null>(null);

  // Stan dla resetowania cache'a
  const [isResettingCache, setIsResettingCache] = useState<boolean>(false);
  const [resetCacheError, setResetCacheError] = useState<Error | null>(null);

  // Pobieranie wyników testów
  const fetchTestResults = useCallback(async () => {
    try {
      setIsLoadingTestResults(true);
      const response = await fetch(
        "/api/test-results?limit=5&sort=timestamp_end&order=desc",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: TestResultListResponseDTO = await response.json();

      // Transformacja danych z API do ViewModel
      const viewModels: TestResultCardViewModel[] = data.data.map((result) => ({
        id: result.id,
        strategy_type: result.strategy_type,
        timestamp_end: result.timestamp_end as string,
        session_id: result.session_id,
        metrics: {
          fp: result.fp,
          fcp: result.fcp,
          tti: result.tti,
          lcp: result.lcp,
          fid: result.fid,
          ttfb: result.ttfb,
          offline_availability: result.offline_availability,
        },
        performanceIndicator: calculatePerformanceIndicator(result),
      }));

      setTestResults(viewModels);
      setErrorTestResults(null);
    } catch (error) {
      console.error("Error fetching test results:", error);
      setErrorTestResults(
        error instanceof Error ? error : new Error("Nieznany błąd"),
      );
    } finally {
      setIsLoadingTestResults(false);
    }
  }, []);

  // Pobieranie sesji testowych
  const fetchTestSessions = useCallback(async () => {
    try {
      setIsLoadingTestSessions(true);
      const response = await fetch(
        "/api/test-sessions?limit=5&sort=created_at&order=desc",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: TestSessionListResponseDTO = await response.json();

      // Transformacja danych z API do ViewModel
      const viewModels: RecentTestSessionViewModel[] = data.data.map(
        (session) => ({
          id: session.id,
          name: session.name,
          description: session.description,
          created_at: session.created_at,
          duration: session.duration as unknown as string,
          status: "unknown",
          // Opcjonalnie można dodać dodatkowe zapytanie o liczbę testów w sesji
          // testCount: await fetchTestCountForSession(session.id)
        }),
      );

      setTestSessions(viewModels);
      setErrorTestSessions(null);
    } catch (error) {
      console.error("Error fetching test sessions:", error);
      setErrorTestSessions(
        error instanceof Error ? error : new Error("Nieznany błąd"),
      );
    } finally {
      setIsLoadingTestSessions(false);
    }
  }, []);

  // Pobieranie porównania strategii
  const fetchStrategyComparison = useCallback(async () => {
    try {
      setIsLoadingStrategyComparison(true);

      // Pobierz najpierw wyniki ostatnich testów dla różnych strategii
      const response = await fetch(
        "/api/test-results?limit=20&sort=timestamp_end&order=desc",
      );

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
        setErrorStrategyComparison(
          new Error("Niewystarczająca liczba strategii do porównania"),
        );
        return;
      }

      // Pobierz porównanie tych wyników
      const comparisonResponse = await fetch(
        `/api/test-results/compare?ids=${ids.join(",")}`,
      );

      if (!comparisonResponse.ok) {
        throw new Error(`HTTP error! Status: ${comparisonResponse.status}`);
      }

      const comparisonData: TestResultComparisonResponseDTO =
        await comparisonResponse.json();

      // Transformacja danych do ViewModel
      const strategies = comparisonData.results.map((r) => r.strategy_type);
      const metrics: Record<string, number[]> = {
        fp: comparisonData.results.map((r) => r.metrics.fp || 0),
        fcp: comparisonData.results.map((r) => r.metrics.fcp || 0),
        tti: comparisonData.results.map((r) => r.metrics.tti || 0),
        lcp: comparisonData.results.map((r) => r.metrics.lcp || 0),
        fid: comparisonData.results.map((r) => r.metrics.fid || 0),
        ttfb: comparisonData.results.map((r) => r.metrics.ttfb || 0),
      };

      const bestStrategy =
        comparisonData.results.find(
          (r) => r.id === comparisonData.comparison.best_overall,
        )?.strategy_type || "";

      const bestMetrics: Record<string, string> = {
        fp:
          comparisonData.results.find(
            (r) =>
              r.id === comparisonData.comparison.metrics_comparison.fp?.best,
          )?.strategy_type || "",
        fcp:
          comparisonData.results.find(
            (r) =>
              r.id === comparisonData.comparison.metrics_comparison.fcp?.best,
          )?.strategy_type || "",
        tti:
          comparisonData.results.find(
            (r) =>
              r.id === comparisonData.comparison.metrics_comparison.tti?.best,
          )?.strategy_type || "",
        lcp:
          comparisonData.results.find(
            (r) =>
              r.id === comparisonData.comparison.metrics_comparison.lcp?.best,
          )?.strategy_type || "",
        fid:
          comparisonData.results.find(
            (r) =>
              r.id === comparisonData.comparison.metrics_comparison.fid?.best,
          )?.strategy_type || "",
        ttfb:
          comparisonData.results.find(
            (r) =>
              r.id === comparisonData.comparison.metrics_comparison.ttfb?.best,
          )?.strategy_type || "",
      };

      setStrategyComparison({
        strategies,
        metrics,
        bestStrategy,
        bestMetrics,
      });
      setErrorStrategyComparison(null);
    } catch (error) {
      console.error("Error fetching strategy comparison:", error);
      setErrorStrategyComparison(
        error instanceof Error ? error : new Error("Nieznany błąd"),
      );
    } finally {
      setIsLoadingStrategyComparison(false);
    }
  }, []);

  // Resetowanie cache'a
  const resetCache = useCallback(async () => {
    try {
      setIsResettingCache(true);
      const response = await fetch("/api/cache/reset", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: CacheResetResponseDTO = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // Odświeżenie danych po zresetowaniu cache'a
      await Promise.all([
        fetchTestResults(),
        fetchTestSessions(),
        fetchStrategyComparison(),
      ]);

      setResetCacheError(null);

      // Można tutaj dodać powiadomienie o sukcesie
      // toast.success('Cache został zresetowany pomyślnie');
    } catch (error) {
      console.error("Error resetting cache:", error);
      setResetCacheError(
        error instanceof Error ? error : new Error("Nieznany błąd"),
      );

      // Można tutaj dodać powiadomienie o błędzie
      // toast.error(`Błąd podczas resetowania cache'a: ${error.message}`);
    } finally {
      setIsResettingCache(false);
    }
  }, [fetchTestResults, fetchTestSessions, fetchStrategyComparison]);

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
    resetCacheError,
  };
}
