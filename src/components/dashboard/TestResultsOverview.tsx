import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TestResultCard from "./TestResultCard";
import type { TestResultCardViewModel } from "@/lib/types/dashboard";

interface TestResultsOverviewProps {
  testResults: TestResultCardViewModel[];
  isLoading: boolean;
  error: Error | null;
}

const TestResultsOverview: React.FC<TestResultsOverviewProps> = ({
  testResults,
  isLoading,
  error,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ostatnie wyniki testów</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
            ))}
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
        ) : testResults.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Brak wyników testów. Rozpocznij nowy test, aby zobaczyć wyniki.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {testResults.map((result) => (
              <TestResultCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultsOverview;
