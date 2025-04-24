// Konfiguracja
let CACHE_NAME = "cache-test-pwa-v1";
let CURRENT_STRATEGY = "network-first"; // Domyślna strategia

// Lista strategii
const STRATEGIES = {
  "network-first": fetchNetworkFirst,
  "cache-first": fetchCacheFirst,
  "stale-while-revalidate": fetchStaleWhileRevalidate,
  "cache-then-network": fetchCacheThenNetwork,
};

// Obsługa instalacji Service Workera
self.addEventListener("install", (event) => {
  console.log("Service Worker: Instalacja");

  // Propozycja dla przeglądarki: aktywuj natychmiast, bez czekania na zamknięcie kart
  self.skipWaiting();
});

// Obsługa aktywacji Service Workera
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Aktywacja");

  // Przejmij kontrolę nad wszystkimi klientami od razu
  event.waitUntil(clients.claim());

  // Usuń stare cache
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Usuwanie starego cache", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Nasłuchiwanie wiadomości od klientów
self.addEventListener("message", (event) => {
  console.log("Service Worker: Otrzymano wiadomość", event.data);

  if (event.data && event.data.type === "CHANGE_STRATEGY") {
    CURRENT_STRATEGY = event.data.strategy;
    console.log("Service Worker: Zmieniono strategię na", CURRENT_STRATEGY);
  }

  if (event.data && event.data.type === "CACHE_RESET") {
    console.log("Service Worker: Resetowanie cache");
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName)),
        );
      }),
    );
  }
});

// Obsługa żądań fetch
self.addEventListener("fetch", (event) => {
  const strategy = STRATEGIES[CURRENT_STRATEGY] || fetchNetworkFirst;
  event.respondWith(strategy(event));
});

// Implementacja Network First
async function fetchNetworkFirst(event) {
  const request = event.request;

  try {
    // Najpierw próbujemy pobrać z sieci
    const networkResponse = await fetch(request);

    // Zapisujemy do cache'a kopię odpowiedzi
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // Jeśli sieć zawiedzie, próbujemy z cache'a
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Jeśli nie ma w cache'u, zwróć błąd
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Implementacja Cache First
async function fetchCacheFirst(event) {
  const request = event.request;

  // Najpierw próbujemy z cache'a
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Jeśli nie ma w cache'u, próbujemy z sieci
  try {
    const networkResponse = await fetch(request);

    // Zapisujemy do cache'a kopię odpowiedzi
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (error) {
    // Jeśli sieć zawiedzie, zwróć błąd
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Implementacja Stale While Revalidate
async function fetchStaleWhileRevalidate(event) {
  const request = event.request;

  // Próbujemy z cache'a
  const cachedResponse = await caches.match(request);

  // Uruchamiamy fetch w tle, niezależnie od tego, czy mamy cache
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    })
    .catch((error) => {
      console.error("Błąd podczas odświeżania cache:", error);
      // Jeśli aktualizacja nie powiedzie się, nadal zwracamy stary wynik
      return null;
    });

  // Jeśli mamy cache, używamy go od razu i odświeżamy w tle
  return cachedResponse || fetchPromise;
}

// Implementacja Cache Then Network
async function fetchCacheThenNetwork(event) {
  const request = event.request;

  // Tworzymy promisę dla cache i sieci jednocześnie
  const cachedResponsePromise = caches.match(request);

  const networkResponsePromise = fetch(request)
    .then(async (networkResponse) => {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return { response: networkResponse, source: "network" };
    })
    .catch((error) => {
      console.error("Błąd podczas pobierania z sieci:", error);
      return { error, source: "network" };
    });

  // Czekamy na cache
  const cachedResponse = await cachedResponsePromise;

  if (cachedResponse) {
    // Jeśli mamy cache, zwracamy go od razu
    // Kontynuujemy proces sieciowy w tle dla odświeżenia cache
    event.waitUntil(networkResponsePromise);
    return cachedResponse;
  }

  // Jeśli nie mamy w cache, czekamy na sieć
  const networkResult = await networkResponsePromise;

  if (networkResult.response) {
    return networkResult.response;
  }

  // Jeśli obydwa zawiodły, zwróć błąd
  return new Response("Both network and cache failed", {
    status: 408,
    headers: { "Content-Type": "text/plain" },
  });
}
