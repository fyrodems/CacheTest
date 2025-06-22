import React, { useEffect, useState, useMemo, useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestResult {
  test_run_id: string;
  session_id: string;
  strategy: string;
  page_scenario: string;
  network_condition: string;
  start_timestamp: string;
  end_timestamp: string;
  lcp_ms?: number;
  fcp_ms?: number;
  load_time_ms?: number;
  // ... inne pola
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
  const lcpStats = useMemo(
    () =>
      getStats(
        filtered
          .map((d) => Number(d.aggregated_metrics?.lcp_ms))
          .filter((v) => !isNaN(v)),
      ),
    [filtered],
  );
  const fcpStats = useMemo(
    () =>
      getStats(
        filtered
          .map((d) => Number(d.aggregated_metrics?.fcp_ms))
          .filter((v) => !isNaN(v)),
      ),
    [filtered],
  );
  const loadStats = useMemo(
    () =>
      getStats(
        filtered.flatMap((d) =>
          Array.isArray(d.resources)
            ? d.resources
                .map((r) => Number(r.load_time_ms))
                .filter((v) => !isNaN(v))
            : [],
        ),
      ),
    [filtered],
  );

  if (loading) return <div>Ładowanie danych...</div>;
  if (error) return <div className="text-red-500">Błąd: {error}</div>;
  if (!data) return <div>Brak danych</div>;

  return (
    <div>
      {/* Panel filtrów */}
      <div className="mb-6 p-4 bg-muted rounded-lg border border-border/40">
        <div className="font-semibold mb-2">Filtruj wyniki:</div>
        <div className="flex flex-wrap gap-4">
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
        </div>
      </div>

      {/* Podsumowanie */}
      {/* ... istniejące podsumowanie ... */}
      {/* Agregacja */}
      <div className="mb-6 p-4 bg-muted rounded-lg border border-border/40">
        <div className="font-semibold mb-2">
          Agregacja wyników (po filtracji):
        </div>
        <ul className="text-sm space-y-1">
          <li>
            Liczba wyników: <b>{filtered.length}</b>
          </li>
          <li>
            LCP (ms): <b>średnia:</b> {lcpStats.avg?.toFixed(0) ?? "-"},{" "}
            <b>mediana:</b> {lcpStats.median?.toFixed(0) ?? "-"}, <b>min:</b>{" "}
            {lcpStats.min ?? "-"}, <b>max:</b> {lcpStats.max ?? "-"}
          </li>
          <li>
            FCP (ms): <b>średnia:</b> {fcpStats.avg?.toFixed(0) ?? "-"},{" "}
            <b>mediana:</b> {fcpStats.median?.toFixed(0) ?? "-"}, <b>min:</b>{" "}
            {fcpStats.min ?? "-"}, <b>max:</b> {fcpStats.max ?? "-"}
          </li>
          <li>
            Load time (ms): <b>średnia:</b> {loadStats.avg?.toFixed(0) ?? "-"},{" "}
            <b>mediana:</b> {loadStats.median?.toFixed(0) ?? "-"}, <b>min:</b>{" "}
            {loadStats.min ?? "-"}, <b>max:</b> {loadStats.max ?? "-"}
          </li>
        </ul>
      </div>

      {/* Istniejące podsumowanie */}
      {data && (
        <div className="mb-6 p-4 bg-muted rounded-lg border border-border/40">
          <div className="font-semibold mb-2">Podsumowanie danych:</div>
          <ul className="text-sm space-y-1">
            <li>
              Liczba testów: <b>{data.length}</b>
            </li>
            <li>
              Liczba unikalnych strategii:{" "}
              <b>{filterOptions.strategies.length}</b> (
              {filterOptions.strategies.join(", ")})
            </li>
            <li>
              Liczba scenariuszy: <b>{filterOptions.scenarios.length}</b> (
              {filterOptions.scenarios.join(", ")})
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
