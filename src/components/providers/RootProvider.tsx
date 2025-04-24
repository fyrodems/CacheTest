import { useEffect, type ReactNode } from "react";
import { AppProvider } from "./AppProvider";
import { registerServiceWorker } from "../../lib/services/serviceWorker";
import { Toaster } from "@/components/ui/sonner";

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider = ({ children }: RootProviderProps) => {
  useEffect(() => {
    // Rejestruj service worker gdy komponent się montuje
    const registerSW = async () => {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error("Nie udało się zarejestrować Service Workera:", error);
      }
    };

    registerSW();
  }, []);

  return (
    <AppProvider>
      {children}
      <Toaster />
    </AppProvider>
  );
};
