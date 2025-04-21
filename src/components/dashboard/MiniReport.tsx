import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMetricValue, getMetricLabel } from "@/lib/types/dashboard";
import type { MiniReportViewModel } from "@/lib/types/dashboard";

interface MiniReportProps {
  report: MiniReportViewModel | null;
  isLoading: boolean;
  error: Error | null;
}

const MiniReport: React.FC<MiniReportProps> = ({
  report,
  isLoading,
  error,
}) => {
  const metricsToShow = ["fcp", "tti", "lcp", "ttfb"];

  const formattedDate = report?.timestamp_end
    ? new Date(report.timestamp_end).toLocaleString("pl-PL", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mini Raport</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-5 bg-muted animate-pulse rounded-md w-2/3" />
            <div className="h-24 bg-muted animate-pulse rounded-md" />
            <div className="h-8 bg-muted animate-pulse rounded-md w-1/3 mx-auto" />
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-destructive">
              Błąd pobierania danych: {error.message}
            </p>
            <button
              className="mt-2 text-primary hover:underline"
              onClick={() => window.location.reload()}
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : !report ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Brak danych do wyświetlenia mini-raportu.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-medium">
                {report.strategy_type === "network-first"
                  ? "Network-First"
                  : report.strategy_type === "cache-first"
                    ? "Cache-First"
                    : report.strategy_type === "stale-while-revalidate"
                      ? "Stale-While-Revalidate"
                      : report.strategy_type === "cache-then-network"
                        ? "Cache-Then-Network"
                        : report.strategy_type}
              </h3>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {metricsToShow.map((key) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {getMetricLabel(key)}
                  </span>
                  <span className="text-md font-medium">
                    {formatMetricValue(
                      key,
                      report.metrics[key as keyof typeof report.metrics],
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => (window.location.href = `/reports/${report.id}`)}
                className="w-full"
              >
                Zobacz pełny raport
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniReport;
