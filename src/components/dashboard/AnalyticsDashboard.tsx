import React, { useEffect, useState, useMemo, useId, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AggregatedMetrics {
  fp_ms?: number;
  fcp_ms?: number;
  lcp_ms?: number;
  tti_ms?: number;
  fid_ms?: number;
  ttfb_ms?: number;
  offline_availability?: boolean;
}

interface Resource {
  url: string;
  type: string;
  size_bytes: number;
  load_time_ms?: number;
  exec_time_ms?: number | null;
  cache_hit?: boolean;
}

interface TestResult {
  test_run_id: string;
  session_id: string;
  strategy: string;
  page_scenario: string;
  network_condition: string;
  start_timestamp: string;
  end_timestamp: string;
  aggregated_metrics?: AggregatedMetrics;
  resources?: Resource[];
}

function getStats(values: number[]) {
  if (!values.length) return { avg: null, median: null, min: null, max: null };
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

const AnalyticsDashboard = () => {
  const [data, setData] = useState<TestResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtry
  const [strategy, setStrategy] = useState<string>("");
  const [scenario, setScenario] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [session, setSession] = useState<string>("");

  const strategyId = useId();
  const scenarioId = useId();
  const networkId = useId();
  const sessionId = useId();

  const [excludeAnomalies, setExcludeAnomalies] = useState(false);
  const anomalySwitchId = useId();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/raw-data-all.json");
        if (!res.ok) throw new Error("Błąd pobierania pliku JSON");
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Wyciągnięcie unikalnych wartości do selectów
  const filterOptions = useMemo(() => {
    if (!data)
      return { strategies: [], scenarios: [], networks: [], sessions: [] };
    return {
      strategies: Array.from(new Set(data.map((d) => d.strategy))).sort(),
      scenarios: Array.from(new Set(data.map((d) => d.page_scenario))).sort(),
      networks: Array.from(
        new Set(data.map((d) => d.network_condition)),
      ).sort(),
      sessions: Array.from(new Set(data.map((d) => d.session_id))).sort(),
    };
  }, [data]);

  // Filtrowanie danych
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (d) =>
        (!strategy || d.strategy === strategy) &&
        (!scenario || d.page_scenario === scenario) &&
        (!network || d.network_condition === network) &&
        (!session || d.session_id === session),
    );
  }, [data, strategy, scenario, network, session]);

  // Agregacja
  const lcpArr = useMemo(
    () =>
      filtered
        .map((d) => Number(d.aggregated_metrics?.lcp_ms))
        .filter((v) => !isNaN(v)),
    [filtered],
  );
  const fcpArr = useMemo(
    () =>
      filtered
        .map((d) => Number(d.aggregated_metrics?.fcp_ms))
        .filter((v) => !isNaN(v)),
    [filtered],
  );
  const loadArr = useMemo(
    () =>
      filtered.flatMap((d) =>
        Array.isArray(d.resources)
          ? d.resources
              .map((r) => Number(r.load_time_ms))
              .filter((v) => !isNaN(v))
          : [],
      ),
    [filtered],
  );

  const lcpStats = useMemo(() => getStats(lcpArr), [lcpArr]);
  const fcpStats = useMemo(() => getStats(fcpArr), [fcpArr]);
  const loadStats = useMemo(() => getStats(loadArr), [loadArr]);

  // Wykrywanie anomalii
  // Outlier = LCP, FCP, load_time_ms > 3x mediana
  const anomalies = useMemo(() => {
    const lcpMed = lcpStats.median ?? 0;
    const fcpMed = fcpStats.median ?? 0;
    const loadMed = loadStats.median ?? 0;
    const outliers: { test: TestResult; reasons: string[] }[] = [];
    filtered.forEach((test) => {
      const reasons: string[] = [];
      const lcp = Number(test.aggregated_metrics?.lcp_ms);
      if (lcpMed && lcp > 3 * lcpMed)
        reasons.push(`LCP > 3x mediana (${lcp} > ${3 * lcpMed})`);
      const fcp = Number(test.aggregated_metrics?.fcp_ms);
      if (fcpMed && fcp > 3 * fcpMed)
        reasons.push(`FCP > 3x mediana (${fcp} > ${3 * fcpMed})`);
      if (Array.isArray(test.resources)) {
        test.resources.forEach((r, idx) => {
          const load = Number(r.load_time_ms);
          if (loadMed && load > 3 * loadMed) {
            reasons.push(
              `Resource #${idx + 1} (${r.url}) load_time_ms > 3x mediana (${load} > ${3 * loadMed})`,
            );
          }
        });
      }
      if (reasons.length) {
        outliers.push({ test, reasons });
      }
    });
    return outliers;
  }, [filtered, lcpStats.median, fcpStats.median, loadStats.median]);

  // Filtrowanie wyników po wykluczeniu anomalii
  const filteredNoAnomalies = useMemo(() => {
    if (!excludeAnomalies) return filtered;
    const outlierIds = new Set(anomalies.map((a) => a.test.test_run_id));
    return filtered.filter((t) => !outlierIds.has(t.test_run_id));
  }, [filtered, excludeAnomalies, anomalies]);

  // Agregacja po wykluczeniu anomalii
  const lcpArrFinal = useMemo(
    () =>
      filteredNoAnomalies
        .map((d) => Number(d.aggregated_metrics?.lcp_ms))
        .filter((v) => !isNaN(v)),
    [filteredNoAnomalies],
  );
  const fcpArrFinal = useMemo(
    () =>
      filteredNoAnomalies
        .map((d) => Number(d.aggregated_metrics?.fcp_ms))
        .filter((v) => !isNaN(v)),
    [filteredNoAnomalies],
  );
  const loadArrFinal = useMemo(
    () =>
      filteredNoAnomalies.flatMap((d) =>
        Array.isArray(d.resources)
          ? d.resources
              .map((r) => Number(r.load_time_ms))
              .filter((v) => !isNaN(v))
          : [],
      ),
    [filteredNoAnomalies],
  );
  const lcpStatsFinal = useMemo(() => getStats(lcpArrFinal), [lcpArrFinal]);
  const fcpStatsFinal = useMemo(() => getStats(fcpArrFinal), [fcpArrFinal]);
  const loadStatsFinal = useMemo(() => getStats(loadArrFinal), [loadArrFinal]);

  if (loading) return <div>Ładowanie danych...</div>;
  if (error) return <div className="text-red-500">Błąd: {error}</div>;
  if (!data) return <div>Brak danych</div>;

  return (
    <div>
      {/* Panel filtrów */}
      <div className="mb-6 p-4 bg-muted rounded-lg border border-border/40">
        <div className="font-semibold mb-2">Filtruj wyniki:</div>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs mb-1" htmlFor={strategyId}>
              Strategia
            </label>
            <Select
              value={strategy || undefined}
              onValueChange={(val) => setStrategy(val)}
            >
              <SelectTrigger
                className="w-[180px]"
                id={strategyId}
                aria-label="Strategia"
              >
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.strategies.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-1" htmlFor={scenarioId}>
              Scenariusz
            </label>
            <Select
              value={scenario || undefined}
              onValueChange={(val) => setScenario(val)}
            >
              <SelectTrigger
                className="w-[180px]"
                id={scenarioId}
                aria-label="Scenariusz"
              >
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.scenarios.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-1" htmlFor={networkId}>
              Warunki sieciowe
            </label>
            <Select
              value={network || undefined}
              onValueChange={(val) => setNetwork(val)}
            >
              <SelectTrigger
                className="w-[180px]"
                id={networkId}
                aria-label="Warunki sieciowe"
              >
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.networks.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-1" htmlFor={sessionId}>
              Sesja
            </label>
            <Select
              value={session || undefined}
              onValueChange={(val) => setSession(val)}
            >
              <SelectTrigger
                className="w-[180px]"
                id={sessionId}
                aria-label="Sesja"
              >
                <SelectValue placeholder="Wszystkie" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.sessions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs mb-1" htmlFor={anomalySwitchId}>
              Wyklucz anomalie
            </label>
            <Switch
              id={anomalySwitchId}
              checked={excludeAnomalies}
              onCheckedChange={setExcludeAnomalies}
            />
          </div>
        </div>
      </div>

      {/* Agregacja */}
      <div className="mb-6 p-4 bg-muted rounded-lg border border-border/40">
        <div className="font-semibold mb-2">
          Agregacja wyników (po filtracji{excludeAnomalies ? ", bez anomalii" : ""}):
        </div>
        <ul className="text-sm space-y-1">
          <li>
            Liczba wyników: <b>{filteredNoAnomalies.length}</b>
          </li>
          <li>
            LCP (ms): <b>średnia:</b> {lcpStatsFinal.avg?.toFixed(0) ?? "-"},{" "}
            <b>mediana:</b> {lcpStatsFinal.median?.toFixed(0) ?? "-"},{" "}
            <b>min:</b> {lcpStatsFinal.min ?? "-"}, <b>max:</b>{" "}
            {lcpStatsFinal.max ?? "-"}
          </li>
          <li>
            FCP (ms): <b>średnia:</b> {fcpStatsFinal.avg?.toFixed(0) ?? "-"},{" "}
            <b>mediana:</b> {fcpStatsFinal.median?.toFixed(0) ?? "-"},{" "}
            <b>min:</b> {fcpStatsFinal.min ?? "-"}, <b>max:</b>{" "}
            {fcpStatsFinal.max ?? "-"}
          </li>
          <li>
            Load time (ms): <b>średnia:</b>{" "}
            {loadStatsFinal.avg?.toFixed(0) ?? "-"}, <b>mediana:</b>{" "}
            {loadStatsFinal.median?.toFixed(0) ?? "-"}, <b>min:</b>{" "}
            {loadStatsFinal.min ?? "-"}, <b>max:</b> {loadStatsFinal.max ?? "-"}
          </li>
        </ul>
      </div>

      {/* Wykluczone anomalie */}
      {excludeAnomalies && anomalies.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 rounded-lg">
          <div className="font-semibold mb-2 text-yellow-900 dark:text-yellow-200">
            Wykluczone anomalie ({anomalies.length}):
          </div>
          <ul className="text-xs space-y-2">
            {anomalies.map((a, idx) => (
              <li key={a.test.test_run_id} className="mb-1">
                <div className="font-mono text-[11px] text-yellow-900 dark:text-yellow-200">
                  {a.test.test_run_id} (sesja: {a.test.session_id})
                </div>
                <ul className="ml-4 list-disc">
                  {a.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Istniejące podsumowanie */}
      {data && (
        <div className="mb-6 p-4 bg-muted rounded-lg border border-border/40">
          <div className="font-semibold mb-2">Podsumowanie danych:</div>
          <ul className="text-sm space-y-1">
            <li>
              Liczba testów: <b>{data.length}</b>
            </li>
            <li>
              Liczba unikalnych strategii: {" "}
              <b>{filterOptions.strategies.length}</b> ({
                filterOptions.strategies.join(", ")
              })
            </li>
            <li>
              Liczba scenariuszy: <b>{filterOptions.scenarios.length}</b> ({
                filterOptions.scenarios.join(", ")
              })
            </li>
            <li>
              Liczba warunków sieciowych: <b>{filterOptions.networks.length}</b>{" "}
              ({filterOptions.networks.join(", ")})
            </li>
            <li>
              Liczba sesji testowych: <b>{filterOptions.sessions.length}</b>
            </li>
          </ul>
        </div>
      )}
      <div className="mb-4">Wczytano {data.length} wyników testów.</div>
      {/* Tu pojawi się dalsza analiza */}
    </div>
  );
};

export default AnalyticsDashboard;
