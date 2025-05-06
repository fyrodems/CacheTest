import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useAppContext } from "../providers/AppProvider";
import { usePerformanceMetrics } from "../../lib/hooks/usePerformanceMetrics";

// COMPONENTS
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResetCacheButton } from "./ResetCacheButton";
import { StrategySelector } from "./StrategySelector";
import { NetworkConditionSelector } from "./NetworkConditionSelector";

interface ImageTestResult {
  id: string;
  name: string;
  size: string;
  dimensions: string;
  loadTime: number | null;
  status: "idle" | "loading" | "completed" | "error";
  error: string | null;
}

interface ImageTest {
  id: string;
  name: string;
  size: number; // in KB
  dimensions: string;
  url: string;
}

export const LargeImagesPage = () => {
  const { currentStrategy, currentNetworkCondition } = useAppContext();
  const { metrics, startMeasuring, stopMeasuring } = usePerformanceMetrics();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageTests, setImageTests] = useState<ImageTest[]>([]);
  const [imageResults, setImageResults] = useState<ImageTestResult[]>([]);
  const timerId = useRef<number | undefined>(undefined);

  // Generate test images
  useEffect(() => {
    const tests: ImageTest[] = [
      {
        id: "image-1mb",
        name: "Krajobraz górski",
        size: 1024,
        dimensions: "1920x1080",
        url: "/test-assets/images/landscape-1mb.jpg",
      },
      {
        id: "image-2mb",
        name: "Miasto nocą",
        size: 2048,
        dimensions: "2560x1440",
        url: "/test-assets/images/cityscape-2mb.jpg",
      },
      {
        id: "image-3mb",
        name: "Plaża o zachodzie słońca",
        size: 3072,
        dimensions: "3840x2160",
        url: "/test-assets/images/beach-3mb.jpg",
      },
      {
        id: "image-5mb",
        name: "Las tropikalny",
        size: 5120,
        dimensions: "4096x2160",
        url: "/test-assets/images/forest-5mb.jpg",
      },
      {
        id: "image-8mb",
        name: "Galaktyka",
        size: 8192,
        dimensions: "7680x4320",
        url: "/test-assets/images/galaxy-8mb.jpg",
      },
      {
        id: "image-10mb",
        name: "Podwodny świat",
        size: 10240,
        dimensions: "8192x4320",
        url: "/test-assets/images/underwater-10mb.jpg",
      },
    ];

    setImageTests(tests);
    initializeResults(tests);
  }, []);

  const initializeResults = (tests: ImageTest[]) => {
    const initialResults: ImageTestResult[] = tests.map((test) => ({
      id: test.id,
      name: test.name,
      size: formatSize(test.size),
      dimensions: test.dimensions,
      loadTime: null,
      status: "idle",
      error: null,
    }));

    setImageResults(initialResults);
  };

  // Timer for test progress
  useEffect(() => {
    if (isRunning && startTime) {
      timerId.current = window.setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - startTime.getTime();
        setElapsedTime(elapsed);

        // Calculate progress based on completed images
        const completedCount = imageResults.filter(
          (result) =>
            result.status === "completed" || result.status === "error",
        ).length;

        const totalCount = imageResults.length;
        const newProgress =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        setProgress(newProgress);

        // Check if all images are completed
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
  }, [isRunning, startTime, imageResults]);

  const startTest = async () => {
    console.log("ble");
    // Reset state
    setIsRunning(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setProgress(0);

    // Reset results
    initializeResults(imageTests);

    // Start measuring performance
    startMeasuring();

    // Start loading images
    loadImages();
  };

  const loadImages = () => {
    // Load each image in sequence
    imageTests.forEach((test, index) => {
      setTimeout(() => {
        loadImage(test, index);
      }, index * 500); // Stagger the starts
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadImage = (test: ImageTest, index: number) => {
    // Update status to loading
    updateImageStatus(test.id, "loading");

    const img = new Image();
    const loadStart = performance.now();

    img.onload = () => {
      const loadEnd = performance.now();
      const loadTime = loadEnd - loadStart;

      // Update load time and status
      updateImageLoadTime(test.id, loadTime);
      updateImageStatus(test.id, "completed");
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    img.onerror = (err) => {
      // Update status to error
      updateImageStatus(test.id, "error", "Failed to load image");
    };

    // Add cache strategy parameter
    img.src = `${test.url}?strategy=${currentStrategy}&t=${Date.now()}`;
  };

  const updateImageStatus = (
    id: string,
    status: ImageTestResult["status"],
    error: string | null = null,
  ) => {
    setImageResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, status, error } : result,
      ),
    );
  };

  const updateImageLoadTime = (id: string, loadTime: number) => {
    setImageResults((prevResults) =>
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
      imageResults,
      totalTime: elapsedTime,
    });

    // Here you would typically send results to your API
  }, [
    currentStrategy,
    currentNetworkCondition,
    elapsedTime,
    imageResults,
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

  const getStatusColor = (status: ImageTestResult["status"]) => {
    switch (status) {
      case "idle":
        return "text-muted-foreground";
      case "loading":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: ImageTestResult["status"]) => {
    switch (status) {
      case "idle":
        return "Oczekiwanie";
      case "loading":
        return "Ładowanie...";
      case "completed":
        return "Ukończono";
      case "error":
        return "Błąd";
      default:
        return "Nieznany";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {imageResults.map((result) => (
          <Card key={result.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{result.name}</h3>
                <div className="text-sm text-muted-foreground">
                  {result.size} | {result.dimensions}
                </div>
              </div>
              <div className={`text-sm ${getStatusColor(result.status)}`}>
                {getStatusText(result.status)}
              </div>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden relative mb-3">
              {result.status === "loading" && (
                <div className="absolute inset-0 animate-pulse bg-blue-500/30" />
              )}
              {result.status === "completed" && (
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "100%" }}
                />
              )}
              {result.status === "error" && (
                <div
                  className="h-full bg-destructive rounded-full"
                  style={{ width: "100%" }}
                />
              )}
            </div>

            <div className="text-sm">
              <div className="text-muted-foreground">Czas ładowania</div>
              <div>
                {result.loadTime !== null ? formatTime(result.loadTime) : "N/A"}
              </div>
            </div>

            {result.error && (
              <div className="mt-2 text-sm text-destructive">
                Błąd: {result.error}
              </div>
            )}

            {result.status === "completed" && (
              <div className="mt-3 h-32 overflow-hidden rounded-md bg-muted relative">
                <img
                  src={imageTests.find((t) => t.id === result.id)?.url || ""}
                  alt={result.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 left-2 text-xs text-white font-medium">
                  {result.name}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

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

      {/* Summary */}
      {!isRunning && imageResults.some((r) => r.status === "completed") && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Podsumowanie</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                Średni czas ładowania
              </div>
              <div>
                {imageResults.filter((r) => r.loadTime !== null).length > 0
                  ? formatTime(
                      imageResults
                        .filter((r) => r.loadTime !== null)
                        .reduce((sum, r) => sum + (r.loadTime || 0), 0) /
                        imageResults.filter((r) => r.loadTime !== null).length,
                    )
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Całkowity czas
              </div>
              <div>{formatTime(elapsedTime)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Ukończone testy
              </div>
              <div>
                {imageResults.filter((r) => r.status === "completed").length} /{" "}
                {imageResults.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Całkowity rozmiar obrazów
              </div>
              <div>
                {formatSize(
                  imageTests.reduce((sum, test) => sum + test.size, 0),
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
