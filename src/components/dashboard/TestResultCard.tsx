import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMetricValue, getMetricLabel } from "@/lib/types/dashboard";
import type { TestResultCardViewModel } from "@/lib/types/dashboard";

interface TestResultCardProps {
  result: TestResultCardViewModel;
}

const TestResultCard: React.FC<TestResultCardProps> = ({ result }) => {
  const formattedDate = new Date(result.timestamp_end).toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Kolorowanie wskaźnika wydajności
  const performanceColors = {
    good: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const strategyLabels = {
    "network-first": "Network-First",
    "cache-first": "Cache-First",
    "stale-while-revalidate": "Stale-While-Revalidate",
    "cache-then-network": "Cache-Then-Network",
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => (window.location.href = `/reports/${result.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            {strategyLabels[
              result.strategy_type as keyof typeof strategyLabels
            ] || result.strategy_type}
          </CardTitle>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${performanceColors[result.performanceIndicator]}`}
          >
            {result.performanceIndicator === "good"
              ? "Dobry"
              : result.performanceIndicator === "medium"
                ? "Średni"
                : "Słaby"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(result.metrics)
            .filter(([key, value]) => value !== null && value !== undefined)
            .slice(0, 4) // Ograniczamy do 4 metryk aby karta nie była zbyt duża
            .map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {getMetricLabel(key)}
                </span>
                <span className="text-sm font-medium">
                  {formatMetricValue(key, value)}
                </span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResultCard;
