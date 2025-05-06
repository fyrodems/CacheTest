/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Code,
  RefreshCw,
} from "lucide-react";
import { StrategySelector } from "./StrategySelector";
import { NetworkConditionSelector } from "./NetworkConditionSelector";
import { ResetCacheButton } from "./ResetCacheButton";
import { useAppContext } from "../providers/AppProvider";
import { usePerformanceMetrics } from "../../lib/hooks/usePerformanceMetrics";

interface ScriptTestResult {
  id: string;
  name: string;
  size: string;
  complexity: "low" | "medium" | "high";
  loadTime: number | null;
  execTime: number | null;
  status: "idle" | "loading" | "executing" | "completed" | "error";
  output: string | null;
  error: string | null;
}

interface ScriptTest {
  id: string;
  name: string;
  size: number; // in KB
  complexity: "low" | "medium" | "high";
  url: string;
  expectedOutput?: string;
}

export const DynamicJSPage = () => {
  const { currentStrategy, currentNetworkCondition } = useAppContext();
  const { metrics, startMeasuring, stopMeasuring } = usePerformanceMetrics();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  const [scriptTests, setScriptTests] = useState<ScriptTest[]>([]);
  const [scriptResults, setScriptResults] = useState<ScriptTestResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerId = useRef<number | undefined>(undefined);
  const scriptOutputRef = useRef<Record<string, string>>({});

  // Generate test scripts
  useEffect(() => {
    const tests: ScriptTest[] = [
      {
        id: "calc-simple",
        name: "Proste obliczenia",
        size: 5,
        complexity: "low",
        url: "/test-assets/scripts/simple-calc.js",
        expectedOutput: "42",
      },
      {
        id: "string-ops",
        name: "Operacje na stringach",
        size: 8,
        complexity: "low",
        url: "/test-assets/scripts/string-operations.js",
        expectedOutput: "Hello World",
      },
      {
        id: "array-filter",
        name: "Filtrowanie tablicy",
        size: 15,
        complexity: "medium",
        url: "/test-assets/scripts/array-filter.js",
        expectedOutput: "[2,4,6,8,10]",
      },
      {
        id: "dom-manipulation",
        name: "Manipulacja DOM",
        size: 25,
        complexity: "medium",
        url: "/test-assets/scripts/dom-manipulation.js",
        expectedOutput: "Created 10 elements",
      },
      {
        id: "recursive-calc",
        name: "Obliczenia rekurencyjne",
        size: 12,
        complexity: "high",
        url: "/test-assets/scripts/recursive-calc.js",
        expectedOutput: "55",
      },
      {
        id: "async-operations",
        name: "Operacje asynchroniczne",
        size: 30,
        complexity: "high",
        url: "/test-assets/scripts/async-operations.js",
        expectedOutput: "Completed 5 async operations",
      },
      {
        id: "data-transform",
        name: "Transformacja danych",
        size: 40,
        complexity: "high",
        url: "/test-assets/scripts/data-transform.js",
        expectedOutput: "Transformed 100 items",
      },
      {
        id: "image-processing",
        name: "Przetwarzanie obrazu",
        size: 60,
        complexity: "high",
        url: "/test-assets/scripts/image-processing.js",
      },
    ];

    setScriptTests(tests);
    initializeResults(tests);
  }, []);

  const initializeResults = (tests: ScriptTest[]) => {
    const initialResults: ScriptTestResult[] = tests.map((test) => ({
      id: test.id,
      name: test.name,
      size: formatSize(test.size),
      complexity: test.complexity,
      loadTime: null,
      execTime: null,
      status: "idle",
      output: null,
      error: null,
    }));

    setScriptResults(initialResults);
    scriptOutputRef.current = {};
  };

  // Override console.log to capture script outputs
  useEffect(() => {
    if (isRunning) {
      const originalConsoleLog = console.log;

      // Create a window property to store current script ID
      (window as any).__currentTestScriptId = "";

      console.log = (...args) => {
        // Keep the original behavior
        originalConsoleLog(...args);

        const currentScriptId = (window as any).__currentTestScriptId;
        if (currentScriptId) {
          const output = args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg),
            )
            .join(" ");

          scriptOutputRef.current[currentScriptId] =
            (scriptOutputRef.current[currentScriptId] || "") + output + "\n";

          // Update the result with the latest output
          setScriptResults((prevResults) =>
            prevResults.map((result) =>
              result.id === currentScriptId
                ? {
                    ...result,
                    output: scriptOutputRef.current[currentScriptId],
                  }
                : result,
            ),
          );
        }
      };

      return () => {
        // Restore original console.log
        console.log = originalConsoleLog;
        (window as any).__currentTestScriptId = "";
      };
    }
  }, [isRunning]);

  // Timer for test progress
  useEffect(() => {
    if (isRunning && startTime) {
      timerId.current = window.setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - startTime.getTime();
        setElapsedTime(elapsed);

        // Calculate progress based on completed scripts
        const completedCount = scriptResults.filter(
          (result) =>
            result.status === "completed" || result.status === "error",
        ).length;

        const totalCount = scriptResults.length;
        const newProgress =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        setProgress(newProgress);

        // Check if all scripts are completed
        if (completedCount === totalCount) {
          handleTestComplete();
        }
      }, 100);
    }

    return () => {
      if (timerId.current) {
        window.clearInterval(timerId.current);
        timerId.current = undefined;
      }
    };
  }, [isRunning, startTime, scriptResults]);

  const startTest = async () => {
    // Reset state
    setIsRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setProgress(0);

    // Reset results
    initializeResults(scriptTests);

    // Create new abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Start measuring performance
    startMeasuring();

    // Start loading and executing scripts
    loadAndExecuteScripts();
  };

  const loadAndExecuteScripts = () => {
    // Load scripts in sequence with a slight delay between each
    scriptTests.forEach((script, index) => {
      setTimeout(() => {
        loadAndExecuteScript(script);
      }, index * 300); // Larger delay to prevent scripts from interfering with each other
    });
  };

  const loadAndExecuteScript = async (script: ScriptTest) => {
    updateScriptStatus(script.id, "loading");

    const url = `${script.url}?strategy=${currentStrategy}&t=${Date.now()}`;
    const loadStartTime = performance.now();

    try {
      const signal = abortControllerRef.current?.signal;
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const scriptText = await response.text();
      const loadEndTime = performance.now();
      const loadTime = loadEndTime - loadStartTime;

      updateScriptLoadTime(script.id, loadTime);
      updateScriptStatus(script.id, "executing");

      // Execute the script and measure execution time
      const execStartTime = performance.now();

      try {
        (window as any).__currentTestScriptId = script.id;

        // Create a safe execution environment
        const executeScript = new Function("window", "document", scriptText);
        executeScript(window, document);

        const execEndTime = performance.now();
        const execTime = execEndTime - execStartTime;

        updateScriptExecTime(script.id, execTime);
        updateScriptStatus(script.id, "completed");

        // Validate output against expected output if provided
        if (script.expectedOutput && scriptOutputRef.current[script.id]) {
          const output = scriptOutputRef.current[script.id].trim();
          if (!output.includes(script.expectedOutput)) {
            console.warn(
              `Script ${script.id} output doesn't match expected output.`,
            );
            console.warn(`Expected: ${script.expectedOutput}`);
            console.warn(`Actual: ${output}`);
          }
        }
      } catch (execError) {
        const errorMessage =
          execError instanceof Error
            ? execError.message
            : "Unknown execution error";
        updateScriptStatus(script.id, "error", errorMessage);
      } finally {
        (window as any).__currentTestScriptId = "";
      }
    } catch (error) {
      // Don't report errors if test was aborted
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      updateScriptStatus(script.id, "error", errorMessage);
    }
  };

  const updateScriptStatus = (
    id: string,
    status: ScriptTestResult["status"],
    error: string | null = null,
  ) => {
    setScriptResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, status, error } : result,
      ),
    );
  };

  const updateScriptLoadTime = (id: string, loadTime: number) => {
    setScriptResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, loadTime } : result,
      ),
    );
  };

  const updateScriptExecTime = (id: string, execTime: number) => {
    setScriptResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, execTime } : result,
      ),
    );
  };

  const handleTestComplete = useCallback(() => {
    setIsRunning(false);
    const results = stopMeasuring();

    if (timerId.current) {
      window.clearInterval(timerId.current);
      timerId.current = undefined;
    }

    console.log("Test completed:", {
      strategy: currentStrategy,
      networkCondition: currentNetworkCondition,
      metrics: results,
      scriptResults,
      totalTime: elapsedTime,
    });

    // Here you would typically send results to your API
  }, [
    currentStrategy,
    currentNetworkCondition,
    elapsedTime,
    scriptResults,
    stopMeasuring,
  ]);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const getComplexityColor = (complexity: ScriptTestResult["complexity"]) => {
    switch (complexity) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: ScriptTestResult["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "executing":
        return <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <StrategySelector disabled={isRunning} />
          <NetworkConditionSelector disabled={isRunning} />
        </div>
        <div className="flex gap-2">
          <ResetCacheButton disabled={isRunning} />
          <Button variant="default" onClick={startTest} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testowanie...
              </>
            ) : (
              "Rozpocznij test"
            )}
          </Button>
        </div>
      </div>

      {isRunning && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Postęp testu</span>
            <span className="text-sm">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Czas: {formatTime(elapsedTime)}
          </div>
        </div>
      )}

      {/* Script tests */}
      <div className="space-y-4">
        <div className="text-sm font-medium">Wyniki testów skryptów</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scriptResults.map((script) => (
            <Card key={script.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{script.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {script.size} • Złożoność:
                      <span
                        className={`ml-1 px-1.5 py-0.5 rounded-sm text-xs ${
                          script.complexity === "low"
                            ? "bg-green-100 text-green-700"
                            : script.complexity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {script.complexity === "low"
                          ? "Niska"
                          : script.complexity === "medium"
                            ? "Średnia"
                            : "Wysoka"}
                      </span>
                    </div>
                  </div>
                </div>
                {getStatusIcon(script.status)}
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Status:</span>
                  <span
                    className={`${
                      script.status === "completed"
                        ? "text-green-500"
                        : script.status === "error"
                          ? "text-destructive"
                          : script.status === "executing"
                            ? "text-amber-500"
                            : script.status === "loading"
                              ? "text-blue-500"
                              : "text-muted-foreground"
                    }`}
                  >
                    {script.status === "idle"
                      ? "Oczekiwanie"
                      : script.status === "loading"
                        ? "Ładowanie"
                        : script.status === "executing"
                          ? "Wykonywanie"
                          : script.status === "completed"
                            ? "Ukończono"
                            : "Błąd"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Czas ładowania:</span>
                  <span>
                    {script.loadTime !== null
                      ? formatTime(script.loadTime)
                      : "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Czas wykonania:</span>
                  <span>
                    {script.execTime !== null
                      ? formatTime(script.execTime)
                      : "N/A"}
                  </span>
                </div>

                {script.status === "completed" &&
                  script.loadTime !== null &&
                  script.execTime !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Całkowity czas:</span>
                      <span>
                        {formatTime(script.loadTime + script.execTime)}
                      </span>
                    </div>
                  )}
              </div>

              {script.error && (
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive overflow-auto max-h-20">
                  {script.error}
                </div>
              )}

              {script.output && (
                <div className="mt-2">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Wyjście skryptu:
                  </div>
                  <div className="p-2 bg-muted/50 rounded text-xs font-mono overflow-auto max-h-32 whitespace-pre-wrap">
                    {script.output}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      {!isRunning && scriptResults.some((r) => r.status === "completed") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">
              Podsumowanie skryptów
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Średni czas ładowania
                </div>
                <div className="text-md">
                  {scriptResults.filter((r) => r.loadTime !== null).length > 0
                    ? formatTime(
                        scriptResults
                          .filter((r) => r.loadTime !== null)
                          .reduce((sum, r) => sum + (r.loadTime || 0), 0) /
                          scriptResults.filter((r) => r.loadTime !== null)
                            .length,
                      )
                    : "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Średni czas wykonania
                </div>
                <div className="text-md">
                  {scriptResults.filter((r) => r.execTime !== null).length > 0
                    ? formatTime(
                        scriptResults
                          .filter((r) => r.execTime !== null)
                          .reduce((sum, r) => sum + (r.execTime || 0), 0) /
                          scriptResults.filter((r) => r.execTime !== null)
                            .length,
                      )
                    : "N/A"}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Całkowity czas
                </div>
                <div className="text-md">{formatTime(elapsedTime)}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Ukończone skrypty
                </div>
                <div className="text-md">
                  {scriptResults.filter((r) => r.status === "completed").length}{" "}
                  / {scriptResults.length}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Błędy</div>
                <div className="text-md">
                  {scriptResults.filter((r) => r.status === "error").length} /{" "}
                  {scriptResults.length}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Czasy wg złożoności</h3>
            <div className="space-y-4">
              {["low", "medium", "high"].map((complexity) => {
                const scriptsOfComplexity = scriptResults.filter(
                  (s) =>
                    s.complexity === complexity &&
                    s.status === "completed" &&
                    s.loadTime !== null &&
                    s.execTime !== null,
                );

                if (scriptsOfComplexity.length === 0) return null;

                const avgLoadTime =
                  scriptsOfComplexity.reduce(
                    (sum, s) => sum + (s.loadTime || 0),
                    0,
                  ) / scriptsOfComplexity.length;
                const avgExecTime =
                  scriptsOfComplexity.reduce(
                    (sum, s) => sum + (s.execTime || 0),
                    0,
                  ) / scriptsOfComplexity.length;

                return (
                  <div key={complexity} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getComplexityColor(complexity as any)}`}
                      ></div>
                      <span className="text-sm font-medium capitalize">
                        {complexity === "low"
                          ? "Niska"
                          : complexity === "medium"
                            ? "Średnia"
                            : "Wysoka"}{" "}
                        złożoność
                      </span>
                    </div>

                    <div className="relative pt-4">
                      <div className="flex h-6 mb-1">
                        <div
                          className="bg-blue-200 flex items-center justify-center text-xs text-blue-800 overflow-hidden"
                          style={{
                            width: `${(avgLoadTime / (avgLoadTime + avgExecTime)) * 100}%`,
                          }}
                        >
                          {avgLoadTime > 200 ? formatTime(avgLoadTime) : ""}
                        </div>
                        <div
                          className="bg-amber-200 flex items-center justify-center text-xs text-amber-800 overflow-hidden"
                          style={{
                            width: `${(avgExecTime / (avgLoadTime + avgExecTime)) * 100}%`,
                          }}
                        >
                          {avgExecTime > 200 ? formatTime(avgExecTime) : ""}
                        </div>
                      </div>
                      <div className="flex text-xs text-muted-foreground justify-between">
                        <span>Ładowanie: {formatTime(avgLoadTime)}</span>
                        <span>Wykonanie: {formatTime(avgExecTime)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {!isRunning && metrics.fcp !== null && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Metryki wydajności</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">First Paint</div>
              <div>{metrics.fp !== null ? formatTime(metrics.fp) : "N/A"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                First Contentful Paint
              </div>
              <div>
                {metrics.fcp !== null ? formatTime(metrics.fcp) : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Largest Contentful Paint
              </div>
              <div>
                {metrics.lcp !== null ? formatTime(metrics.lcp) : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Time to Interactive
              </div>
              <div>
                {metrics.tti !== null ? formatTime(metrics.tti) : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                First Input Delay
              </div>
              <div>
                {metrics.fid !== null ? formatTime(metrics.fid) : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Time to First Byte
              </div>
              <div>
                {metrics.ttfb !== null ? formatTime(metrics.ttfb) : "N/A"}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
