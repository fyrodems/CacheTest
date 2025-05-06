import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { StrategySelector } from "./StrategySelector";
import { NetworkConditionSelector } from "./NetworkConditionSelector";
import { ResetCacheButton } from "./ResetCacheButton";
import { useAppContext } from "../providers/AppProvider";
import { usePerformanceMetrics } from "../../lib/hooks/usePerformanceMetrics";

interface ResourceTestResult {
  id: string;
  name: string;
  type: string;
  size: string;
  loadTime: number | null;
  status: "idle" | "loading" | "completed" | "error";
  error: string | null;
}

interface ResourceTest {
  id: string;
  name: string;
  type: "json" | "css" | "js" | "font" | "svg" | "html";
  size: number; // in KB
  url: string;
}

const ResourceTypeIcons: Record<string, string> = {
  json: "📄",
  css: "🎨",
  js: "⚙️",
  font: "🔤",
  svg: "🖼️",
  html: "📑",
};

const ResourceTypeColors: Record<string, string> = {
  json: "bg-blue-500",
  css: "bg-pink-500",
  js: "bg-yellow-500",
  font: "bg-purple-500",
  svg: "bg-green-500",
  html: "bg-orange-500",
};

export const SmallResourcesPage = () => {
  const { currentStrategy, currentNetworkCondition } = useAppContext();
  const { metrics, startMeasuring, stopMeasuring } = usePerformanceMetrics();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  const [resourceTests, setResourceTests] = useState<ResourceTest[]>([]);
  const [resourceResults, setResourceResults] = useState<ResourceTestResult[]>(
    [],
  );
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerId = useRef<number | undefined>(undefined);

  // Generate test resources
  useEffect(() => {
    const tests: ResourceTest[] = [
      {
        id: "json-small",
        name: "Mała konfiguracja",
        type: "json",
        size: 5,
        url: "/test-assets/resources/config-small.json",
      },
      {
        id: "json-medium",
        name: "Średni zestaw danych",
        type: "json",
        size: 50,
        url: "/test-assets/resources/data-medium.json",
      },
      {
        id: "css-small",
        name: "Style podstawowe",
        type: "css",
        size: 8,
        url: "/test-assets/resources/base-styles.css",
      },
      {
        id: "css-medium",
        name: "Style komponentów",
        type: "css",
        size: 30,
        url: "/test-assets/resources/components.css",
      },
      {
        id: "js-small",
        name: "Skrypt pomocniczy",
        type: "js",
        size: 10,
        url: "/test-assets/resources/helpers.js",
      },
      {
        id: "js-medium",
        name: "Biblioteka funkcji",
        type: "js",
        size: 45,
        url: "/test-assets/resources/library.js",
      },
      {
        id: "font-woff",
        name: "Czcionka WOFF",
        type: "font",
        size: 25,
        url: "/test-assets/resources/font.woff2",
      },
      {
        id: "svg-icon",
        name: "Ikona SVG",
        type: "svg",
        size: 3,
        url: "/test-assets/resources/icon.svg",
      },
      {
        id: "svg-logo",
        name: "Logo SVG",
        type: "svg",
        size: 12,
        url: "/test-assets/resources/logo.svg",
      },
      {
        id: "html-template",
        name: "Szablon HTML",
        type: "html",
        size: 15,
        url: "/test-assets/resources/template.html",
      },
    ];

    setResourceTests(tests);
    initializeResults(tests);
  }, []);

  const initializeResults = (tests: ResourceTest[]) => {
    const initialResults: ResourceTestResult[] = tests.map((test) => ({
      id: test.id,
      name: test.name,
      type: test.type,
      size: formatSize(test.size),
      loadTime: null,
      status: "idle",
      error: null,
    }));

    setResourceResults(initialResults);
  };

  // Timer for test progress
  useEffect(() => {
    if (isRunning && startTime) {
      timerId.current = window.setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - startTime.getTime();
        setElapsedTime(elapsed);

        // Calculate progress based on completed resources
        const completedCount = resourceResults.filter(
          (result) =>
            result.status === "completed" || result.status === "error",
        ).length;

        const totalCount = resourceResults.length;
        const newProgress =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        setProgress(newProgress);

        // Check if all resources are completed
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
  }, [isRunning, startTime, resourceResults]);

  const startTest = async () => {
    // Reset state
    setIsRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setProgress(0);

    // Reset results
    initializeResults(resourceTests);

    // Create new abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Start measuring performance
    startMeasuring();

    // Start loading resources
    loadResources();
  };

  const loadResources = () => {
    // Load resources in parallel with a slight delay between each
    resourceTests.forEach((resource, index) => {
      setTimeout(() => {
        loadResource(resource);
      }, index * 100); // Stagger starts slightly
    });
  };

  const loadResource = async (resource: ResourceTest) => {
    updateResourceStatus(resource.id, "loading");

    const url = `${resource.url}?strategy=${currentStrategy}&t=${Date.now()}`;
    const startTime = performance.now();

    try {
      const signal = abortControllerRef.current?.signal;
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // For different resource types, we need to process them differently
      switch (resource.type) {
        case "json":
          await response.json();
          break;
        case "css":
        case "js":
        case "html":
        case "svg":
          await response.text();
          break;
        case "font":
          await response.arrayBuffer();
          break;
      }

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      updateResourceLoadTime(resource.id, loadTime);
      updateResourceStatus(resource.id, "completed");
    } catch (error) {
      // Don't report errors if test was aborted
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      updateResourceStatus(resource.id, "error", errorMessage);
    }
  };

  const updateResourceStatus = (
    id: string,
    status: ResourceTestResult["status"],
    error: string | null = null,
  ) => {
    setResourceResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, status, error } : result,
      ),
    );
  };

  const updateResourceLoadTime = (id: string, loadTime: number) => {
    setResourceResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, loadTime } : result,
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
      resourceResults,
      totalTime: elapsedTime,
    });

    // Here you would typically send results to your API
  }, [
    currentStrategy,
    currentNetworkCondition,
    elapsedTime,
    resourceResults,
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

  const getIconForType = (type: string) => {
    return ResourceTypeIcons[type] || "📦";
  };

  const getColorForType = (type: string) => {
    return ResourceTypeColors[type] || "bg-gray-500";
  };

  const getStatusIcon = (status: ResourceTestResult["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
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

      {/* Resource tests grid */}
      <div className="space-y-1">
        <div className="text-sm font-medium py-2">Wyniki testów zasobów</div>
        <Card className="p-4">
          <div className="space-y-4">
            {/* Resource type groups */}
            {["json", "css", "js", "font", "svg", "html"].map((type) => {
              const typeResources = resourceResults.filter(
                (r) => r.type === type,
              );
              if (typeResources.length === 0) return null;

              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getColorForType(type)}`}
                    ></div>
                    <span className="text-sm font-medium capitalize">
                      {type}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {typeResources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/30 hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg">
                            {getIconForType(resource.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {resource.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {resource.size}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {resource.status === "loading" && (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                          )}

                          {resource.status === "completed" &&
                            resource.loadTime !== null && (
                              <div className="text-sm">
                                {formatTime(resource.loadTime)}
                              </div>
                            )}

                          {resource.status === "error" && (
                            <div
                              className="text-xs text-destructive max-w-[200px] truncate"
                              title={resource.error || undefined}
                            >
                              {resource.error}
                            </div>
                          )}

                          {getStatusIcon(resource.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Resource counts summary */}
      {!isRunning && resourceResults.some((r) => r.status === "completed") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Podsumowanie typów</h3>
            <div className="grid grid-cols-3 gap-2">
              {["json", "css", "js", "font", "svg", "html"].map((type) => {
                const count = resourceResults.filter(
                  (r) => r.type === type,
                ).length;
                const completed = resourceResults.filter(
                  (r) => r.type === type && r.status === "completed",
                ).length;

                if (count === 0) return null;

                return (
                  <div
                    key={type}
                    className="flex flex-col items-center p-2 rounded-md bg-muted/30"
                  >
                    <div className="text-xl mb-1">{getIconForType(type)}</div>
                    <div className="text-sm font-medium capitalize">{type}</div>
                    <div className="text-xs text-muted-foreground">
                      {completed}/{count}
                    </div>
                    <div className="w-full h-1 bg-muted mt-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getColorForType(type)}`}
                        style={{ width: `${(completed / count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Statystyki zasobów</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Średni czas ładowania
                </div>
                <div className="text-md">
                  {resourceResults.filter((r) => r.loadTime !== null).length > 0
                    ? formatTime(
                        resourceResults
                          .filter((r) => r.loadTime !== null)
                          .reduce((sum, r) => sum + (r.loadTime || 0), 0) /
                          resourceResults.filter((r) => r.loadTime !== null)
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
                  Ukończone zasoby
                </div>
                <div className="text-md">
                  {
                    resourceResults.filter((r) => r.status === "completed")
                      .length
                  }{" "}
                  / {resourceResults.length}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Łączny rozmiar zasobów
                </div>
                <div className="text-md">
                  {formatSize(
                    resourceTests.reduce((sum, test) => sum + test.size, 0),
                  )}
                </div>
              </div>
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
