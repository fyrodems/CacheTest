# Schemat bazy danych PostgreSQL dla CacheTest PWA

## 1. Lista tabel

### users
Przechowuje informacje o użytkownikach systemu.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator użytkownika |
| email | text | NOT NULL, UNIQUE | Adres email użytkownika |
| auth_provider | text | NOT NULL | Dostawca OAuth (np. 'google', 'github') |
| auth_id | text | NOT NULL | Identyfikator użytkownika z dostawcy OAuth |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | Data utworzenia konta |
| last_login | timestamp with time zone | | Data ostatniego logowania |

### test_sessions
Przechowuje informacje o sesjach testowych.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator sesji |
| user_id | uuid | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Powiązanie z użytkownikiem |
| name | text | NOT NULL | Nazwa sesji testowej |
| description | text | | Opis sesji testowej |
| created_at | timestamp with time zone | NOT NULL, DEFAULT now() | Data utworzenia sesji |
| duration | interval | | Całkowity czas trwania sesji |

### test_results
Przechowuje szczegółowe wyniki testów dla każdej strategii cache'owania.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator wyniku |
| session_id | uuid | NOT NULL, REFERENCES test_sessions(id) ON DELETE CASCADE | Powiązanie z sesją |
| strategy_type | text | NOT NULL | Typ strategii cache'owania (network-first, cache-first, stale-while-revalidate, cache-then-network) |
| fp | numeric | | First Paint (ms) |
| fcp | numeric | | First Contentful Paint (ms) |
| tti | numeric | | Time to Interactive (ms) |
| lcp | numeric | | Largest Contentful Paint (ms) |
| fid | numeric | | First Input Delay (ms) |
| ttfb | numeric | | Time to First Byte (ms) |
| offline_availability | boolean | | Dostępność offline |
| timestamp_start | timestamp with time zone | NOT NULL, DEFAULT now() | Czas rozpoczęcia testu |
| timestamp_end | timestamp with time zone | | Czas zakończenia testu |
| raw_metrics | jsonb | | Dodatkowe metryki w formacie JSON |

### environment_info
Przechowuje informacje o środowisku testowym.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator |
| session_id | uuid | NOT NULL, REFERENCES test_sessions(id) ON DELETE CASCADE | Powiązanie z sesją |
| browser | text | NOT NULL | Nazwa przeglądarki |
| browser_version | text | NOT NULL | Wersja przeglądarki |
| os | text | NOT NULL | System operacyjny |
| os_version | text | NOT NULL | Wersja systemu operacyjnego |
| device_type | text | | Typ urządzenia (desktop, mobile, tablet) |
| additional_info | jsonb | | Dodatkowe informacje o środowisku |

### network_conditions
Przechowuje informacje o symulowanych warunkach sieciowych.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator |
| session_id | uuid | NOT NULL, REFERENCES test_sessions(id) ON DELETE CASCADE | Powiązanie z sesją |
| condition_type | text | NOT NULL | Typ warunków (good, slow, flaky, offline) |
| latency | integer | | Opóźnienie w ms |
| bandwidth | integer | | Przepustowość w kbps |
| packet_loss | numeric | | Utrata pakietów w % |
| additional_config | jsonb | | Dodatkowa konfiguracja warunków sieciowych |

### resource_metrics
Przechowuje szczegółowe informacje o zasobach testowanych podczas sesji.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator |
| session_id | uuid | NOT NULL, REFERENCES test_sessions(id) ON DELETE CASCADE | Powiązanie z sesją |
| result_id | uuid | REFERENCES test_results(id) ON DELETE CASCADE | Powiązanie z konkretnym wynikiem testu |
| resource_url | text | NOT NULL | URL zasobu |
| resource_type | text | NOT NULL | Typ zasobu (image, css, js, font, etc.) |
| size | integer | | Rozmiar zasobu w bajtach |
| mime_type | text | | Typ MIME zasobu |
| load_time | numeric | | Czas ładowania zasobu w ms |
| cache_hit | boolean | | Czy zasób został załadowany z cache'a |
| strategy_used | text | | Strategia użyta dla tego zasobu |
| additional_metrics | jsonb | | Dodatkowe metryki zasobu |

### tags
Przechowuje dostępne tagi do kategoryzacji testów.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| id | uuid | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unikalny identyfikator tagu |
| name | text | NOT NULL, UNIQUE | Nazwa tagu |
| category | text | NOT NULL | Kategoria tagu (strategy, resource, network) |

### test_tags
Tabela łącząca do relacji wiele-do-wielu między testami a tagami.

| Kolumna | Typ | Ograniczenia | Opis |
|---------|-----|--------------|------|
| test_id | uuid | NOT NULL, REFERENCES test_results(id) ON DELETE CASCADE | Powiązanie z testem |
| tag_id | uuid | NOT NULL, REFERENCES tags(id) ON DELETE CASCADE | Powiązanie z tagiem |
| PRIMARY KEY | (test_id, tag_id) | | Klucz złożony |

## 2. Relacje między tabelami

- Użytkownik (users) może mieć wiele sesji testowych (test_sessions) - relacja jeden-do-wielu
- Sesja testowa (test_sessions) może mieć wiele wyników testów (test_results) - relacja jeden-do-wielu
- Sesja testowa (test_sessions) może mieć jedną informację o środowisku (environment_info) - relacja jeden-do-jednego
- Sesja testowa (test_sessions) może mieć jedną informację o warunkach sieciowych (network_conditions) - relacja jeden-do-jednego
- Sesja testowa (test_sessions) może mieć wiele metryk zasobów (resource_metrics) - relacja jeden-do-wielu
- Wynik testu (test_results) może mieć wiele metryk zasobów (resource_metrics) - relacja jeden-do-wielu
- Wynik testu (test_results) może mieć wiele tagów (tags) poprzez tabelę łączącą test_tags - relacja wiele-do-wielu

## 3. Indeksy

```sql
-- Indeksy dla users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth ON users(auth_provider, auth_id);

-- Indeksy dla test_sessions
CREATE INDEX idx_test_sessions_user_id ON test_sessions(user_id);
CREATE INDEX idx_test_sessions_created_at ON test_sessions(created_at);

-- Indeksy dla test_results
CREATE INDEX idx_test_results_session_id ON test_results(session_id);
CREATE INDEX idx_test_results_strategy_type ON test_results(strategy_type);
CREATE INDEX idx_test_results_timestamp_start ON test_results(timestamp_start);
CREATE INDEX idx_test_results_metrics ON test_results(fp, fcp, tti, lcp, fid, ttfb);

-- Indeksy dla environment_info
CREATE INDEX idx_environment_info_session_id ON environment_info(session_id);
CREATE INDEX idx_environment_info_browser ON environment_info(browser, browser_version);
CREATE INDEX idx_environment_info_os ON environment_info(os, os_version);

-- Indeksy dla network_conditions
CREATE INDEX idx_network_conditions_session_id ON network_conditions(session_id);
CREATE INDEX idx_network_conditions_type ON network_conditions(condition_type);

-- Indeksy dla resource_metrics
CREATE INDEX idx_resource_metrics_session_id ON resource_metrics(session_id);
CREATE INDEX idx_resource_metrics_result_id ON resource_metrics(result_id);
CREATE INDEX idx_resource_metrics_resource_type ON resource_metrics(resource_type);
CREATE INDEX idx_resource_metrics_cache_hit ON resource_metrics(cache_hit);

-- Indeksy dla test_tags
CREATE INDEX idx_test_tags_test_id ON test_tags(test_id);
CREATE INDEX idx_test_tags_tag_id ON test_tags(tag_id);
```

## 4. Zasady PostgreSQL Row Level Security (RLS)

```sql
-- Włącz RLS dla wszystkich tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_tags ENABLE ROW LEVEL SECURITY;

-- Polityki dla tabeli users
CREATE POLICY users_select ON users FOR SELECT 
    USING (auth.uid() = id);
    
CREATE POLICY users_update ON users FOR UPDATE 
    USING (auth.uid() = id);

-- Polityki dla tabeli test_sessions
CREATE POLICY test_sessions_select ON test_sessions FOR SELECT 
    USING (user_id = auth.uid());
    
CREATE POLICY test_sessions_insert ON test_sessions FOR INSERT 
    WITH CHECK (user_id = auth.uid());
    
CREATE POLICY test_sessions_update ON test_sessions FOR UPDATE 
    USING (user_id = auth.uid());
    
CREATE POLICY test_sessions_delete ON test_sessions FOR DELETE 
    USING (user_id = auth.uid());

-- Polityki dla tabeli test_results
CREATE POLICY test_results_select ON test_results FOR SELECT 
    USING (session_id IN (SELECT id FROM test_sessions WHERE user_id = auth.uid()));
    
CREATE POLICY test_results_insert ON test_results FOR INSERT 
    WITH CHECK (session_id IN (SELECT id FROM test_sessions WHERE user_id = auth.uid()));
    
CREATE POLICY test_results_update ON test_results FOR UPDATE 
    USING (session_id IN (SELECT id FROM test_sessions WHERE user_id = auth.uid()));
    
CREATE POLICY test_results_delete ON test_results FOR DELETE 
    USING (session_id IN (SELECT id FROM test_sessions WHERE user_id = auth.uid()));

-- Podobne polityki dla pozostałych tabel (environment_info, network_conditions, resource_metrics, test_tags)
-- każda sprawdza powiązanie z test_sessions i użytkownikiem

-- Polityka dla tabeli tags (dostępne dla wszystkich)
CREATE POLICY tags_select ON tags FOR SELECT 
    USING (true);
```

## 5. Dodatkowe uwagi

1. **Typy JSONB dla elastyczności**:
   - Wykorzystano typy JSONB dla złożonych danych (raw_metrics, additional_info, additional_config, additional_metrics), co pozwala na przechowywanie dodatkowych informacji bez konieczności modyfikacji schematu.

2. **Soft Delete**:
   - W przyszłości warto rozważyć implementację mechanizmu soft delete dla historycznych danych (np. dodając kolumnę deleted_at).

3. **Eksport danych**:
   - Funkcje do eksportu danych do CSV/JSON można zaimplementować na poziomie aplikacji lub jako funkcje PostgreSQL.

4. **Skalowalność**:
   - Struktura jest zaprojektowana z myślą o obsłudze wielu użytkowników i dużej liczby testów.
   - W przypadku znacznego wzrostu danych, warto rozważyć partycjonowanie tabel (np. test_results) według daty.

5. **Uwierzytelnianie**:
   - Schema bazuje na uwierzytelnianiu Supabase poprzez OAuth.
   - Zasady RLS są skonfigurowane tak, aby użytkownicy mieli dostęp tylko do swoich danych.

6. **Migracje**:
   - Przy implementacji warto utworzyć skrypty migracyjne, które tworzą schemat, indeksy i polityki RLS.

7. **Wartości domyślne**:
   - Wykorzystano wartości domyślne (DEFAULT) dla identyfikatorów UUID i znaczników czasu, aby ułatwić wstawianie danych.

8. **Relacje**:
   - Wykorzystano kaskadowe usuwanie (ON DELETE CASCADE) dla kluczy obcych, aby zachować spójność danych. 