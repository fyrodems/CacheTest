import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { StrategyComparisonViewModel } from "@/lib/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StrategyComparisonChartProps {
  data: StrategyComparisonViewModel | null;
  isLoading: boolean;
  error: Error | null;
}

const StrategyComparisonChart: React.FC<StrategyComparisonChartProps> = ({
  data,
  isLoading,
  error,
}) => {
  // Colors for the bars (should match your theme)
  const colors = {
    "network-only": "#2563eb", // blue
    "cache-first": "#16a34a", // green
    "stale-while-revalidate": "#d97706", // amber
    "network-first": "#dc2626", // red
  };

  // Transform data for the chart
  const transformDataForChart = (data: StrategyComparisonViewModel) => {
    const metricNames = Object.keys(data.metrics);
    return metricNames.map((metricName) => {
      const chartData: any = { metric: getMetricLabel(metricName) };
      data.strategies.forEach((strategy, index) => {
        chartData[strategy] = data.metrics[metricName][index];
      });
      return chartData;
    });
  };

  // Get readable metric label
  const getMetricLabel = (key: string): string => {
    const labels: Record<string, string> = {
      fp: "First Paint",
      fcp: "First Contentful Paint",
      tti: "Time to Interactive",
      lcp: "Largest Contentful Paint",
      fid: "First Input Delay",
      ttfb: "Time to First Byte",
    };
    return labels[key] || key;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Porównanie strategii</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[300px]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Porównanie strategii</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nie udało się załadować danych porównawczych: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.strategies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Porównanie strategii</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">
            Brak danych do porównania strategii. Uruchom testy, aby zobaczyć
            wyniki.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = transformDataForChart(data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Porównanie strategii</CardTitle>
        {data.bestStrategy && (
          <Badge variant="success" className="ml-2">
            Najlepsza: {data.bestStrategy}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.strategies.map((strategy) => (
              <Bar
                key={strategy}
                dataKey={strategy}
                name={strategy}
                fill={colors[strategy as keyof typeof colors] || "#888888"}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StrategyComparisonChart;
