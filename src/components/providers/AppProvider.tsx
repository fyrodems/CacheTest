import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { CachingStrategy, NetworkCondition } from "../../lib/types/cache";
import type { TestSessionResponseDTO } from "../../types";

export interface AppState {
  currentStrategy: CachingStrategy;
  currentNetworkCondition: NetworkCondition;
  isOnline: boolean;
  cacheSize: number;
  currentTestSession: TestSessionResponseDTO | null;

  setStrategy: (strategy: CachingStrategy) => void;
  setNetworkCondition: (condition: NetworkCondition) => void;
  resetCache: () => Promise<void>;
  createTestSession: (
    name: string,
    description?: string,
  ) => Promise<string | null>;
}

export const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [currentStrategy, setCurrentStrategy] = useState<CachingStrategy>(
    CachingStrategy.NETWORK_FIRST,
  );

  const [currentNetworkCondition, setCurrentNetworkCondition] =
    useState<NetworkCondition>(NetworkCondition.GOOD);

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [currentTestSession, setCurrentTestSession] =
    useState<TestSessionResponseDTO | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStrategy = localStorage.getItem(
        "cacheStrategy",
      ) as CachingStrategy;
      const storedCondition = localStorage.getItem(
        "networkCondition",
      ) as NetworkCondition;

      if (storedStrategy) setCurrentStrategy(storedStrategy);
      if (storedCondition) setCurrentNetworkCondition(storedCondition);

      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cacheStrategy", currentStrategy);

      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CHANGE_STRATEGY",
          strategy: currentStrategy,
        });
      }
    }
  }, [currentStrategy]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("networkCondition", currentNetworkCondition);
    }
  }, [currentNetworkCondition]);

  useEffect(() => {
    const updateCacheSize = async () => {
      if (
        typeof navigator !== "undefined" &&
        "storage" in navigator &&
        "estimate" in navigator.storage
      ) {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          setCacheSize(Math.round(estimate.usage / 1024 / 1024));
        }
      }
    };

    updateCacheSize();

    const interval = setInterval(updateCacheSize, 30000);
    return () => clearInterval(interval);
  }, []);

  const resetCache = async (): Promise<void> => {
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));

        setCacheSize(0);

        if (
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller
        ) {
          navigator.serviceWorker.controller.postMessage({
            type: "CACHE_RESET",
          });
        }
      }
    } catch (error) {
      console.error("Error resetting cache:", error);
      throw error;
    }
  };

  const createTestSession = async (
    name: string,
    description?: string,
  ): Promise<string | null> => {
    try {
      const response = await fetch("/api/test-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentTestSession(data);
      return data.id;
    } catch (error) {
      console.error("Error creating test session:", error);
      return null;
    }
  };

  const value = {
    currentStrategy,
    currentNetworkCondition,
    isOnline,
    cacheSize,
    currentTestSession,

    setStrategy: setCurrentStrategy,
    setNetworkCondition: setCurrentNetworkCondition,
    resetCache,
    createTestSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
