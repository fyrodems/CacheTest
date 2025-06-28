import React from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

interface ScatterLCPvsFCPProps {
  data: any[]; // tablica TestResult
}

const ScatterLCPvsFCP: React.FC<ScatterLCPvsFCPProps> = ({ data }) => {
  // Filtruj tylko testy z oboma wartościami liczbowymi
  const points = data
    .filter(
      (d) =>
        typeof d.aggregated_metrics?.lcp_ms === "number" &&
        !isNaN(d.aggregated_metrics.lcp_ms) &&
        typeof d.aggregated_metrics?.fcp_ms === "number" &&
        !isNaN(d.aggregated_metrics.fcp_ms)
    )
    .map((d) => ({
      x: d.aggregated_metrics.fcp_ms,
      y: d.aggregated_metrics.lcp_ms,
      testId: d.test_run_id,
      strategy: d.strategy,
      scenario: d.page_scenario,
    }));

  const scatterData = [
    {
      id: "Testy",
      data: points,
    },
  ];

  if (!points.length) return <div>Brak danych do wyświetlenia scatter plotu LCP vs. FCP.</div>;

  return (
    <div style={{ height: 350 }}>
      <ResponsiveScatterPlot
        data={scatterData}
        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        xScale={{ type: "linear", min: "auto", max: "auto" }}
        yScale={{ type: "linear", min: "auto", max: "auto" }}
        axisBottom={{
          legend: "FCP (ms)",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "LCP (ms)",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        tooltip={({ node }) => (
          <span>
            <b>Test: {node.data.testId}</b>
            <br />Strategia: <b>{node.data.strategy}</b>
            <br />Scenariusz: <b>{node.data.scenario}</b>
            <br />FCP: <b>{node.data.x}</b> ms
            <br />LCP: <b>{node.data.y}</b> ms
          </span>
        )}
        colors={{ scheme: "nivo" }}
        nodeSize={8}
        animate
      />
    </div>
  );
};

export default ScatterLCPvsFCP; 