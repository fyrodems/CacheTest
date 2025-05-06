/**
 * Rejestruje Service Worker dla aplikacji
 * @returns Promise z obiektem rejestracji Service Workera
 */
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker zarejestrowany pomyślnie", registration);
      return registration;
    } catch (error) {
      console.error("Błąd rejestracji Service Workera:", error);
      throw error;
    }
  } else {
    throw new Error("Service Workers nie są obsługiwane przez tę przeglądarkę");
  }
};

/**
 * Sprawdza, czy Service Worker jest aktywny
 * @returns Promise z wartością boolean
 */
export const isServiceWorkerActive = async (): Promise<boolean> => {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    return !!registration?.active;
  }
  return false;
};

/**
 * Wysyła wiadomość do Service Workera
 * @param message Obiekt wiadomości do wysłania
 * @returns Promise który rozwiązuje się po wysłaniu wiadomości
 */
export const sendMessageToServiceWorker = async (
  message: unknown,
): Promise<void> => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    console.warn(
      "Service Worker nie jest aktywny, nie można wysłać wiadomości",
    );
  }
};
