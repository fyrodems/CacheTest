import React, { useState } from "react";
import StrategyComparisonChart from "@/components/dashboard/StrategyComparisonChart";
import RecentTestSessionsList from "@/components/dashboard/RecentTestSessionsList";
import CachingStrategiesInfo from "@/components/dashboard/CachingStrategiesInfo";
import ActionButtons from "@/components/dashboard/ActionButtons";
import ToastProvider from "@/components/providers/ToastProvider";
import { toast } from "sonner";

const DashboardTest = () => {
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Sample data for testing
  const strategyComparison = {
    strategies: [
      "network-only",
      "cache-first",
      "stale-while-revalidate",
      "network-first",
    ],
    metrics: {
      fp: [1200, 800, 900, 1000],
      fcp: [1800, 1200, 1400, 1600],
      tti: [4200, 3800, 4000, 4100],
      lcp: [3000, 2600, 2800, 2900],
      fid: [200, 100, 150, 180],
      ttfb: [900, 700, 800, 850],
    },
    bestStrategy: "cache-first",
    bestMetrics: {
      fp: "cache-first",
      fcp: "cache-first",
      tti: "cache-first",
      lcp: "cache-first",
      fid: "cache-first",
      ttfb: "cache-first",
    },
  };

  const sessions = [
    {
      id: "1",
      name: "Test sesji #1",
      description: "Pierwszy test",
      created_at: "2023-06-01T10:00:00Z",
      duration: "2m 30s",
      testCount: 4,
      status: "success",
    },
    {
      id: "2",
      name: "Test sesji #2",
      description: "Drugi test",
      created_at: "2023-06-02T14:30:00Z",
      duration: "3m 15s",
      testCount: 4,
      status: "failed",
    },
    {
      id: "3",
      name: "Test sesji #3",
      description: "Trzeci test",
      created_at: "2023-06-03T16:45:00Z",
      duration: "1m 45s",
      testCount: 4,
      status: "pending",
    },
  ];

  const strategies = [
    {
      name: "Cache First",
      description:
        "Pobiera zasoby z cache, a następnie z sieci tylko jeśli są niedostępne w cache.",
      useCase:
        "Idealny dla statycznych zasobów takich jak obrazy, CSS, które rzadko się zmieniają.",
      learnMoreUrl:
        "https://web.dev/offline-cookbook/#cache-falling-back-to-network",
    },
    {
      name: "Network First",
      description:
        "Próbuje pobrać zasoby z sieci, a następnie używa cache jako zapasowego źródła.",
      useCase:
        "Najlepszy dla często aktualizowanych danych, gdzie aktualne informacje są priorytetem.",
      learnMoreUrl:
        "https://web.dev/offline-cookbook/#network-falling-back-to-cache",
    },
    {
      name: "Stale While Revalidate",
      description:
        "Serwuje dane z cache, a następnie aktualizuje cache z sieci w tle.",
      useCase:
        "Idealny dla treści która może być nieco przestarzała, ale wymaga szybkiego wyświetlenia.",
      learnMoreUrl: "https://web.dev/offline-cookbook/#stale-while-revalidate",
    },
    {
      name: "Network Only",
      description: "Zawsze pobiera zasoby z sieci, ignorując cache.",
      useCase:
        "Dla krytycznych danych, które zawsze muszą być aktualne (np. bankowość).",
      learnMoreUrl: "https://web.dev/offline-cookbook/#network-only",
    },
  ];

  const handleRunTest = () => {
    setIsRunningTest(true);
    toast.info("Rozpoczęto test wydajnościowy...");

    // Symulacja trwania testu
    setTimeout(() => {
      setIsRunningTest(false);
      toast.success("Test zakończony pomyślnie!");
    }, 3000);
  };

  const handleOpenSettings = () => {
    toast.info("Otwarto ustawienia");
  };

  return (
    <>
      <ToastProvider />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard PWA</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ActionButtons
            onRunTest={handleRunTest}
            onOpenSettings={handleOpenSettings}
            isRunningTest={isRunningTest}
          />
          <RecentTestSessionsList
            sessions={sessions}
            isLoading={false}
            error={null}
          />
        </div>

        <div className="mb-6">
          <StrategyComparisonChart
            data={strategyComparison}
            isLoading={false}
            error={null}
          />
        </div>

        <div className="mb-6">
          <CachingStrategiesInfo strategies={strategies} />
        </div>
      </div>
    </>
  );
};

export default DashboardTest;
