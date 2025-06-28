import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface LoadTimeHistogramProps {
  data: number[];
}

function getHistogramBins(values: number[], binCount = 20) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / binCount || 1;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    bin: `${Math.round(min + i * binSize)}-${Math.round(min + (i + 1) * binSize)}`,
    count: 0,
  }));
  values.forEach((v) => {
    const idx = Math.min(
      binCount - 1,
      Math.floor((v - min) / binSize)
    );
    bins[idx].count++;
  });
  return bins;
}

const LoadTimeHistogram: React.FC<LoadTimeHistogramProps> = ({ data }) => {
  const bins = getHistogramBins(data, 20);
  if (!data.length) return <div>Brak danych do wyświetlenia histogramu load_time_ms.</div>;
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
          legend: "load_time_ms",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "Liczba zasobów",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        tooltip={({ indexValue, value }) => (
          <span>
            Przedział: <b>{indexValue}</b>
            <br />Liczba zasobów: <b>{value}</b>
          </span>
        )}
        animate
        enableLabel={false}
      />
    </div>
  );
};

export default LoadTimeHistogram; 