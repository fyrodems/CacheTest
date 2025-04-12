# Aplikacja - PWA (MVP)

## Główny problem
Brak wdrożenia odpowiednich strategii cache’owania w aplikacjach webowych prowadzi do wolnego ładowania zasobów oraz ograniczonej dostępności offline, co negatywnie wpływa na doświadczenie użytkownika. Aplikacja ma służyć jako środowisko testowe do porównania wydajności różnych strategii cache’owania zasobów przy pomocy Service Worker i odpowiadać na pytania która strategia jest najlepsza.

## Najmniejszy zestaw funkcjonalności
Co wchodzi w skład MVP?

- Prosta aplikacja webowa z kilkoma podstronami i statycznymi zasobami (HTML, CSS, JS, obrazy)
- Rejestracja Service Workera
- Implementacja czterech strategii cache’owania: Network-first, Cache-first, Stale-while-revalidate, Cache-then-network
- Symulacja działania aplikacji w trybie offline
- Pomiar kluczowych wskaźników wydajności: FP, FCP, TTI, Offline Availability
- Teoretyczne porównanie wyników na podstawie danych z narzędzi typu Lighthouse
- Umożliwienie analizy wyników dla każdego scenariusza.

## Co NIE wchodzi w skład MVP
- Implementacja backendu ani żadnej formy komunikacji z bazą danych.
- Dynamiczne treści (np. interakcje użytkownika, logowanie, API).
- Realne wdrożenie aplikacji na serwerze produkcyjnym.
- Projektowanie UI/UX z naciskiem na estetykę.
- Automatyzacja testów (np. CI/CD, testy jednostkowe).

## Kryteria sukcesu
- Stworzenie teoretycznego środowiska badawczego do testów strategii cache’owania.
- Porównanie wpływu każdej strategii na szybkość ładowania aplikacji oraz jej dostępność offline.
- Opracowanie zestawu rekomendacji dotyczących wyboru strategii cache’owania w zależności od typu aplikacji webowej.
- Przedstawienie wyników w sposób zrozumiały, z danymi liczbowymi i wizualizacjami.
- Wnioski wspierające dobre praktyki w projektowaniu wydajnych i dostępnych aplikacji webowych.