import React from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";

interface ScatterLoadVsExecProps {
  data: any[]; // tablica TestResult
}

const ScatterLoadVsExec: React.FC<ScatterLoadVsExecProps> = ({ data }) => {
  // Filtruj tylko dynamic-js i zasoby z oboma wartościami liczbowymi
  const points = data
    .filter((d) => d.page_scenario === "dynamic-js" && Array.isArray(d.resources))
    .flatMap((d) =>
      d.resources
        .filter(
          (r: any) =>
            typeof r.load_time_ms === "number" &&
            !isNaN(r.load_time_ms) &&
            typeof r.exec_time_ms === "number" &&
            !isNaN(r.exec_time_ms)
        )
        .map((r: any) => ({
          x: r.load_time_ms,
          y: r.exec_time_ms,
          resource: r.url,
          testId: d.test_run_id,
        }))
    );

  const scatterData = [
    {
      id: "Zasoby dynamic-js",
      data: points,
    },
  ];

  if (!points.length) return <div>Brak danych do wyświetlenia scatter plotu load_time_ms vs. exec_time_ms.</div>;

  return (
    <div style={{ height: 350 }}>
      <ResponsiveScatterPlot
        data={scatterData}
        margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        xScale={{ type: "linear", min: "auto", max: "auto" }}
        yScale={{ type: "linear", min: "auto", max: "auto" }}
        axisBottom={{
          legend: "load_time_ms",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          legend: "exec_time_ms",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        tooltip={({ node }) => (
          <span>
            <b>{node.data.resource}</b>
            <br />load_time_ms: <b>{node.data.x}</b>
            <br />exec_time_ms: <b>{node.data.y}</b>
            <br />test: <b>{node.data.testId}</b>
          </span>
        )}
        colors={{ scheme: "nivo" }}
        nodeSize={8}
        animate
      />
    </div>
  );
};

export default ScatterLoadVsExec; 