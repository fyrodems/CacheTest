<conversation_summary>
<decisions>
Dashboard jest stroną startową aplikacji, przedstawiającą wyniki ostatnich testów i kluczowe metryki.
Główna nawigacja zawiera: dashboard, stronę z dużymi obrazami, stronę z małymi zasobami, stronę z dynamicznym JS.
Wybór strategii cache'owania jest dostępny globalnie w headerze (jako dropdown).
Metryki wydajności są prezentowane jako rozbudowane wykresy.
Symulacja warunków sieciowych jest dostępna z poziomu headera dla każdej podstrony (jako dropdown).
Autentykacja powinna być maksymalnie uproszczona.
Materiały edukacyjne są zintegrowane z interfejsem jako krótkie opisy, a rozbudowane materiały dostępne na osobnej podstronie.
Wyniki testów prezentowane są w formie tabelarycznej i jako wykresy.
Tagi w systemie są predefiniowane, nie edytowalne przez użytkownika.
Generowanie raportów dostępne jest zarówno jako osobna strona, jak i komponent zagnieżdżony w dashboardzie.
Przycisk resetowania cache'a jest umieszczony globalnie w headerze i działa natychmiastowo.
Aplikacja oferuje gotowe presety testowe (około 5 z każdej kategorii).
Zasoby wyświetlane są jako paginowana lista z wyborem liczby elementów na stronie.
Stan online/offline jest wyraźnie widoczny w headerze obok wyboru warunków sieciowych.
Responsywność nie jest priorytetem, ale interfejs nie powinien się rozjeżdżać.
Aplikacja zapamiętuje ostatnio używaną strategię cache (w localStorage).
Konfiguracja testu dostępna jest po rozpoczęciu nowego testu.
Dla więcej niż 2 opcji stosowany jest dropdown, dla 2 opcji - przełącznik.
Możliwe jest jednoczesne uruchomienie testu na wszystkich strategiach cache'owania.
Interfejs pokazuje stany testów: w trakcie, zakończone, błąd.
Aplikacja wyświetla szacowany czas trwania testu.
Wykresy są interaktywne (zoom, hover dla szczegółów).
Historia testów dostępna jest zarówno na dashboardzie (skrótowo), jak i na osobnej stronie (szczegółowo).
Strony z dużymi obrazami i małymi zasobami mają układ siatki.
Aplikacja zawiera wskaźnik wielkości cache'a.
Aplikacja oferuje rekomendacje dotyczące optymalnej strategii na podstawie wyników.
Błędy są raportowane ze szczegółami wyjaśniającymi ich przyczynę.
Aplikacja zawiera tryb prezentacyjny dla wyników.
</decisions>
<matched_recommendations>
Zaprojektować dashboard jako centralne miejsce z wyraźnym CTA do uruchomienia testów oraz sekcją ostatnich wyników i szybkich porównań.
Zaimplementować header z trzema kluczowymi kontrolkami: dropdown strategii cache'owania, dropdown warunków sieciowych i przycisk resetowania cache.
Dodać wyraźny wskaźnik stanu online/offline obok kontrolki warunków sieciowych, z odpowiednim kodowaniem kolorystycznym.
Stworzyć prosty layout z górnym headerem, bocznym menu nawigacyjnym i głównym obszarem treści, wykorzystując komponenty Shadcn/ui.
Zaprojektować widok porównawczy jako tabele z danymi liczbowymi obok interaktywnych wykresów słupkowych/liniowych.
Predefiniowane scenariusze testowe przedstawić jako karty z ikonami reprezentującymi ich charakterystykę.
Implementować raport jako stronę z sekcjami: podsumowanie, szczegółowe metryki, lista zasobów, wnioski.
Stworzyć przycisk "Testuj wszystkie strategie" dla szybkiego porównania wszystkich strategii w jednym cyklu.
Wyświetlać listę zasobów jako prostą, sortowalną tabelę z najważniejszymi informacjami (URL, typ, rozmiar, czas ładowania) z paginacją.
Implementować interaktywne wykresy z funkcjami: hover dla szczegółów, zoom, zmiana typu wykresu i eksport jako obraz.
Dodać system powiadomień dla statusów testów (rozpoczęcie, zakończenie, błąd) w formie toast notifications.
Zaprojektować "Mini-Raport" na dashboardzie pokazujący najważniejsze metryki z ostatniego testu z odnośnikiem do pełnego raportu.
Wyświetlać szacowany czas trwania testu jako timer odliczający w dół podczas testu.
Zaprojektować strony z zasobami (duże obrazy, małe zasoby) jako siatki z podstawowymi metrykami wydajności.
Dodać tryb prezentacyjny dla wyników z czystym interfejsem i większymi wykresami, idealny do prezentacji dla zespołu/klienta.
</matched_recommendations>
<ui_architecture_planning_summary>
Architektura UI dla CacheTest PWA
Struktura główna
Aplikacja CacheTest PWA będzie zorganizowana wokół czterech głównych widoków dostępnych z menu nawigacyjnego:
Dashboard (strona startowa) - centralny punkt aplikacji zawierający wyniki ostatnich testów, kluczowe metryki i szybki dostęp do głównych funkcji
Strona z dużymi obrazami - widok w formie siatki z dużymi obrazami do testowania
Strona z małymi zasobami - widok w formie siatki z małymi zasobami (ikony, CSS, JS)
Strona z dynamicznym JS - specjalna strona do testowania dynamicznie ładowanego JavaScriptu
Główne elementy interfejsu
Header globalny
Header zawiera kluczowe kontrolki dostępne z każdego miejsca w aplikacji:
Dropdown wyboru strategii cache'owania (Network-first, Cache-first, Stale-while-revalidate, Cache-then-network)
Dropdown symulacji warunków sieciowych (dobre, wolne, przerywane, offline)
Wyraźny wskaźnik stanu online/offline z kodowaniem kolorystycznym
Przycisk natychmiastowego resetowania cache'a
Wskaźnik wielkości cache'a
Menu użytkownika z opcjami logowania/wylogowania
Dashboard
Sekcja z wynikami ostatnich testów pokazująca wszystkie kluczowe metryki
Przyciski CTA do uruchomienia testów
Mini-raport z odnośnikiem do pełnego raportu
Sekcja szybkiego porównania strategii
Skrócona historia testów
Krótkie opisy edukacyjne o strategiach cache'owania
Strony testowe
Każda z trzech stron testowych (duże obrazy, małe zasoby, dynamiczny JS) zawiera:
Zasoby wyświetlane w układzie siatki
Wskaźniki wydajności w czasie rzeczywistym
Przycisk do rozpoczęcia testu
Możliwość wyboru presetów testowych
System raportowania
Osobna strona raportów z sekcjami: podsumowanie, szczegółowe metryki, wizualizacje, lista zasobów, wnioski
Komponent mini-raportu na dashboardzie
Przycisk generowania raportu
Możliwość eksportu raportu (CSV/JSON)
Tryb prezentacyjny z czystym interfejsem i większymi wykresami
Widoki analityczne
Interaktywne wykresy z funkcjami: hover dla szczegółów, zoom, eksport jako obraz
Tabele z danymi liczbowymi obok wykresów
Widok porównawczy dla wszystkich strategii
Paginowana i sortowalna tabela zasobów z filtrowaniem i wyborem liczby elementów na stronie
Przepływy użytkownika
Podstawowy przepływ testowania
Użytkownik wchodzi na dashboard
Wybiera strategię cache'owania i warunki sieciowe z dropdownów w headerze
Przechodzi do wybranej strony testowej (duże obrazy/małe zasoby/dynamiczny JS)
Uruchamia test (lub opcjonalnie "Testuj wszystkie strategie")
Obserwuje postęp testu z timerem odliczającym czas trwania
Po zakończeniu testu przegląda wyniki i metryki
Opcjonalnie generuje raport
Przepływ analizy wyników
Użytkownik przegląda wyniki na dashboardzie
Przechodzi do szczegółowego raportu
Analizuje interaktywne wykresy i tabele danych
Przegląda listę zasobów i ich metryki
Zapoznaje się z rekomendacjami dotyczącymi optymalnej strategii
Przepływ konfiguracji testów
Użytkownik rozpoczyna nowy test
Wybiera preset testowy lub konfiguruje test ręcznie
Określa warunki sieciowe
Uruchamia test i obserwuje jego postęp
Integracja z API
Autoryzacja zrealizowana przez Supabase Auth z maksymalnie uproszczonym interfejsem
Zapisywanie wyników testów przez endpoint POST /api/test-results
Pobieranie historii testów przez GET /api/test-sessions i GET /api/test-results
Zarządzanie środowiskiem testowym przez odpowiednie endpointy API
Synchronizacja stanu cache'a przez POST /api/cache/reset
Zarządzanie stanem aplikacji
Ostatnio używana strategia cache'owania zapisywana w localStorage
Komunikaty o statusie testów (w trakcie, zakończone, błąd) pokazywane poprzez toast notifications
Wyraźne informowanie o błędach ze szczegółami wyjaśniającymi ich przyczynę
</ui_architecture_planning_summary>
<unresolved_issues>
Nie określono dokładnie, jak powinna wyglądać strona z dynamicznym JS - należy doprecyzować ten widok.
Nie ustalono szczegółów integracji materiałów edukacyjnych z interfejsem - krótkie opisy zostały wybrane, ale ich dokładne umiejscowienie wymaga doprecyzowania.
Nie określono dokładnie, jak powinien wyglądać tryb prezentacyjny dla wyników.
Brak szczegółów dotyczących procesu autentykacji i rejestracji użytkownika (wskazano jedynie, że ma być "najprostszy").
Nie ustalono dokładnie, jak wyglądać będzie symulacja różnych warunków sieciowych na poziomie implementacyjnym.
Brak decyzji odnośnie metody prezentacji rekomendacji optymalnej strategii cache'owania na podstawie wyników.
</unresolved_issues>
</conversation_summary>