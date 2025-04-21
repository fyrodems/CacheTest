import React from "react";
import { useDashboardData } from "../../lib/hooks/useDashboardData";
import DashboardHeader from "./DashboardHeader";
import TestResultsOverview from "./TestResultsOverview";
import MiniReport from "./MiniReport";
import StrategyComparisonChart from "./StrategyComparisonChart";
import RecentTestSessionsList from "./RecentTestSessionsList";
import CachingStrategiesInfo from "./CachingStrategiesInfo";
import ActionButtons from "./ActionButtons";
import CacheResetButton from "./CacheResetButton";

const Dashboard: React.FC = () => {
  const {
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
  } = useDashboardData();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader
        title="CacheTest PWA Dashboard"
        description="Monitoruj i porównuj wydajność różnych strategii cache'owania"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TestResultsOverview
          testResults={testResults}
          isLoading={isLoadingTestResults}
          error={errorTestResults}
        />

        <MiniReport
          report={
            testResults.length > 0
              ? {
                  id: testResults[0].id,
                  strategy_type: testResults[0].strategy_type,
                  timestamp_end: testResults[0].timestamp_end,
                  metrics: testResults[0].metrics,
                  performanceIndicator: testResults[0].performanceIndicator,
                }
              : null
          }
          isLoading={isLoadingTestResults}
          error={errorTestResults}
        />
      </div>

      <StrategyComparisonChart
        data={strategyComparison}
        isLoading={isLoadingStrategyComparison}
        error={errorStrategyComparison}
      />

      <RecentTestSessionsList
        sessions={testSessions}
        isLoading={isLoadingTestSessions}
        error={errorTestSessions}
      />

      <CachingStrategiesInfo
        strategies={[
          {
            name: "Network-first",
            description: "Priorytet dla świeżych danych z sieci",
            useCase: "Dane, które często się zmieniają i wymagają aktualności",
            learnMoreUrl: "/education#network-first",
          },
          {
            name: "Cache-first",
            description: "Priorytet dla szybkości ładowania",
            useCase: "Statyczne zasoby, rzadko zmieniane dane",
            learnMoreUrl: "/education#cache-first",
          },
          {
            name: "Stale-while-revalidate",
            description: "Równoważenie szybkości i świeżości danych",
            useCase: "Dane, które mogą być nieznacznie nieaktualne",
            learnMoreUrl: "/education#stale-while-revalidate",
          },
          {
            name: "Cache-then-network",
            description: "Równoległe ładowanie z cache i sieci",
            useCase: "Dynamiczne treści wymagające natychmiastowej odpowiedzi",
            learnMoreUrl: "/education#cache-then-network",
          },
        ]}
      />

      <ActionButtons />

      <div className="flex justify-end">
        <CacheResetButton onReset={resetCache} isResetting={isResettingCache} />
      </div>
    </div>
  );
};

export default Dashboard;
