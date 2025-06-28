import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface MetricGroupedBarChartProps {
  data: any[];
  metric: string; // np. "lcp_ms"
  groupBy: string; // np. "strategy"
  label?: string;
}

function getStats(values: number[]) {
  if (!values.length) return { avg: 0, median: 0, min: 0, max: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median =
    sorted.length % 2 === 1
      ? sorted[Math.floor(sorted.length / 2)]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  return { avg, median, min, max };
}

function prepareGroupedBarData(data: any[], metric: string, groupBy: string) {
  // Grupowanie po groupBy, wartości metryki jako tablica
  const groups: Record<string, number[]> = {};
  data.forEach((d) => {
    const group = d[groupBy];
    const value = Number(d.aggregated_metrics?.[metric]);
    if (!isNaN(value)) {
      if (!groups[group]) groups[group] = [];
      groups[group].push(value);
    }
  });
  // Zbierz wszystkie możliwe wartości groupBy z danych
  const allGroups = Array.from(new Set(data.map((d) => d[groupBy])));
  return allGroups.map((key) => {
    const values = groups[key] || [];
    const stats = getStats(values);
    return {
      [groupBy]: key,
      avg: stats.avg,
      median: stats.median,
      min: stats.min,
      max: stats.max,
    };
  });
}

const MetricGroupedBarChart: React.FC<MetricGroupedBarChartProps> = ({ data, metric, groupBy, label }) => {
  const chartData = prepareGroupedBarData(data, metric, groupBy);
  if (!chartData.length) return <div>Brak danych do wyświetlenia wykresu.</div>;
  return (
    <div style={{ height: 350 }}>
      <ResponsiveBar
        data={chartData}
        keys={["avg", "median", "min", "max"]}
        indexBy={groupBy}
        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        colors={{ scheme: "nivo" }}
        axisBottom={{
          legend: label || groupBy,
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: metric,
          legendPosition: "middle",
          legendOffset: -50,
        }}
        tooltip={({ id, value, indexValue }) => (
          <span>
            {id} dla <b>{indexValue}</b>: <b>{value?.toFixed(0)}</b>
          </span>
        )}
        animate
        enableLabel={false}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: 20,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 80,
            itemHeight: 20,
            itemDirection: "left-to-right",
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default MetricGroupedBarChart; 