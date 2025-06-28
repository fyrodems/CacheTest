import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface MetricHistogramProps {
  data: number[];
  label: string;
  axisLabel?: string;
  min?: number;
  max?: number;
  binCount?: number;
}

function getHistogramBins(values: number[], binCount = 20, min?: number, max?: number) {
  if (!values.length) return [];
  const realMin = typeof min === "number" ? min : Math.min(...values);
  const realMax = typeof max === "number" ? max : Math.max(...values);
  const binSize = (realMax - realMin) / binCount || 1;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    bin: `${Math.round(realMin + i * binSize)}-${Math.round(realMin + (i + 1) * binSize)}`,
    count: 0,
  }));
  values.forEach((v) => {
    const idx = Math.min(
      binCount - 1,
      Math.floor((v - realMin) / binSize)
    );
    bins[idx].count++;
  });
  return bins;
}

const MetricHistogram: React.FC<MetricHistogramProps> = ({ data, label, axisLabel, min, max, binCount = 20 }) => {
  const bins = getHistogramBins(data, binCount, min, max);
  if (!data.length) return <div>Brak danych do wyświetlenia histogramu {label}.</div>;
  return (
    <div style={{ height: 300 }}>
      <ResponsiveBar
        data={bins}
        keys={["count"]}
        indexBy="bin"
        margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
        padding={0.2}
        colors={{ scheme: "nivo" }}
        axisBottom={{
          tickRotation: 45,
          legend: label,
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: axisLabel || "Liczba testów",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        tooltip={({ indexValue, value }) => (
          <span>
            Przedział: <b>{indexValue}</b>
            <br />{axisLabel || "Liczba testów"}: <b>{value}</b>
          </span>
        )}
        animate
        enableLabel={false}
      />
    </div>
  );
};

export default MetricHistogram; 