-- Migracja danych testowych dla aplikacji CacheTest PWA
-- Ta migracja dodaje dane testowe do wszystkich tabel

-- Czyszczenie danych (opcjonalne, zakomentuj jeśli nie chcesz usuwać danych)
DELETE FROM test_tags;
DELETE FROM resource_metrics;
DELETE FROM test_results;
DELETE FROM network_conditions;
DELETE FROM environment_info;
DELETE FROM test_sessions;
DELETE FROM tags;
DELETE FROM users;

-- Dodanie użytkowników testowych
INSERT INTO public.users (id, email, auth_provider, auth_id, created_at, last_login) VALUES
('c9e6b892-1d5d-4c29-a8a8-f7b7b23c9dc6', 'test1@example.com', 'email', 'test1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d7f8e456-3c2b-4a19-b7a7-e6d5c4b3a2f1', 'test2@example.com', 'email', 'test2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dodanie tagów dla kategoryzacji testów
INSERT INTO public.tags (id, name, category) VALUES
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'cache-first', 'strategy'),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'network-first', 'strategy'),
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'stale-while-revalidate', 'strategy'),
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'cache-then-network', 'strategy'),
('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'images', 'resource'),
('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'scripts', 'resource'),
('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d', 'stylesheets', 'resource'),
('8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e', 'good', 'network'),
('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 'slow', 'network'),
('0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a', 'offline', 'network'),
('1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b', 'performance', 'feature'),
('2f3a4b5c-6d7e-8f9a-0b1c-2d3e4f5a6b7c', 'reliability', 'feature'),
('3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c', 'unique-tag-1', 'custom'),
('4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c', 'unique-tag-2', 'custom');

-- Dodanie sesji testowych
INSERT INTO public.test_sessions (id, user_id, name, description, created_at, duration) VALUES
('f1e2d3c4-b5a6-7890-1234-567890abcdef', 'c9e6b892-1d5d-4c29-a8a8-f7b7b23c9dc6', 'Session 1: Image loading comparison', 'Comparing caching strategies for image loading', CURRENT_TIMESTAMP - INTERVAL '2 days', INTERVAL '2 hours'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c9e6b892-1d5d-4c29-a8a8-f7b7b23c9dc6', 'Session 2: Script loading tests', 'Testing script loading with different strategies', CURRENT_TIMESTAMP - INTERVAL '1 day', INTERVAL '1 hour 30 minutes'),
('9f8e7d6c-5b4a-3210-fedc-ba9876543210', 'd7f8e456-3c2b-4a19-b7a7-e6d5c4b3a2f1', 'Session 3: CSS performance', 'Analyzing CSS loading performance', CURRENT_TIMESTAMP - INTERVAL '3 days', INTERVAL '45 minutes');

-- Dodanie informacji o środowisku
INSERT INTO public.environment_info (id, session_id, browser, browser_version, os, os_version, device_type, additional_info) VALUES
('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', 'Chrome', '115.0.5790.110', 'Windows', '11', 'desktop', '{"screen_resolution": "1920x1080", "memory": "16GB", "cores": 8}'),
('c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Firefox', '115.0.2', 'macOS', '13.4', 'desktop', '{"screen_resolution": "2560x1600", "memory": "32GB", "cores": 10}'),
('a1b2c3d4-e5f6-7890-9a0b-1c2d3e4f5a6b', '9f8e7d6c-5b4a-3210-fedc-ba9876543210', 'Safari', '16.5', 'iOS', '16.5', 'mobile', '{"screen_resolution": "1170x2532", "memory": "6GB", "cores": 6}');

-- Dodanie informacji o warunkach sieciowych
INSERT INTO public.network_conditions (id, session_id, condition_type, latency, bandwidth, packet_loss, additional_config) VALUES
('a1e2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', 'good', 20, 5000, 0, '{"jitter": 5, "throttle_cpu": false}'),
('b2e3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'slow', 150, 1000, 2, '{"jitter": 25, "throttle_cpu": true}'),
('c3e4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', '9f8e7d6c-5b4a-3210-fedc-ba9876543210', 'offline', null, null, 100, '{"jitter": null, "throttle_cpu": false}');

-- Dodanie wyników testów
INSERT INTO public.test_results (id, session_id, strategy_type, fp, fcp, tti, lcp, fid, ttfb, offline_availability, timestamp_start, timestamp_end, raw_metrics) VALUES
-- Wyniki dla Sesji 1
('11111111-1111-1111-1111-111111111111', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', 'cache-first', 150, 220, 550, 800, 25, 80, true, CURRENT_TIMESTAMP - INTERVAL '2 days 1 hour', CURRENT_TIMESTAMP - INTERVAL '2 days 50 minutes', 
'{"first_meaningful_paint": 300, "speed_index": 450, "dom_size": 1200, "dom_nodes": 120, "js_heap_size": 15000000}'),

('22222222-2222-2222-2222-222222222222', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', 'network-first', 180, 250, 620, 900, 30, 100, false, CURRENT_TIMESTAMP - INTERVAL '2 days 45 minutes', CURRENT_TIMESTAMP - INTERVAL '2 days 35 minutes', 
'{"first_meaningful_paint": 350, "speed_index": 500, "dom_size": 1200, "dom_nodes": 120, "js_heap_size": 15000000}'),

('33333333-3333-3333-3333-333333333333', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', 'stale-while-revalidate', 160, 230, 580, 850, 27, 90, true, CURRENT_TIMESTAMP - INTERVAL '2 days 30 minutes', CURRENT_TIMESTAMP - INTERVAL '2 days 20 minutes', 
'{"first_meaningful_paint": 320, "speed_index": 470, "dom_size": 1200, "dom_nodes": 120, "js_heap_size": 15000000}'),

('44444444-4444-4444-4444-444444444444', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', 'cache-then-network', 165, 235, 600, 870, 28, 95, true, CURRENT_TIMESTAMP - INTERVAL '2 days 15 minutes', CURRENT_TIMESTAMP - INTERVAL '2 days 5 minutes', 
'{"first_meaningful_paint": 330, "speed_index": 480, "dom_size": 1200, "dom_nodes": 120, "js_heap_size": 15000000}'),

-- Wyniki dla Sesji 2
('55555555-5555-5555-5555-555555555555', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cache-first', 110, 180, 450, 650, 20, 70, true, CURRENT_TIMESTAMP - INTERVAL '1 day 1 hour', CURRENT_TIMESTAMP - INTERVAL '1 day 50 minutes', 
'{"first_meaningful_paint": 250, "speed_index": 400, "dom_size": 800, "dom_nodes": 90, "js_heap_size": 12000000}'),

('66666666-6666-6666-6666-666666666666', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'network-first', 140, 210, 520, 750, 25, 90, false, CURRENT_TIMESTAMP - INTERVAL '1 day 45 minutes', CURRENT_TIMESTAMP - INTERVAL '1 day 35 minutes', 
'{"first_meaningful_paint": 280, "speed_index": 450, "dom_size": 800, "dom_nodes": 90, "js_heap_size": 12000000}'),

-- Wyniki dla Sesji 3
('77777777-7777-7777-7777-777777777777', '9f8e7d6c-5b4a-3210-fedc-ba9876543210', 'cache-first', 130, 200, 520, 750, 25, 85, true, CURRENT_TIMESTAMP - INTERVAL '3 days 1 hour', CURRENT_TIMESTAMP - INTERVAL '3 days 50 minutes', 
'{"first_meaningful_paint": 270, "speed_index": 430, "dom_size": 1000, "dom_nodes": 100, "js_heap_size": 10000000}'),

('88888888-8888-8888-8888-888888888888', '9f8e7d6c-5b4a-3210-fedc-ba9876543210', 'stale-while-revalidate', 140, 210, 550, 780, 28, 95, true, CURRENT_TIMESTAMP - INTERVAL '3 days 45 minutes', CURRENT_TIMESTAMP - INTERVAL '3 days 35 minutes', 
'{"first_meaningful_paint": 290, "speed_index": 450, "dom_size": 1000, "dom_nodes": 100, "js_heap_size": 10000000}');

-- Dodanie metryk zasobów
INSERT INTO public.resource_metrics (id, session_id, result_id, resource_url, resource_type, size, mime_type, load_time, cache_hit, strategy_used, additional_metrics) VALUES
-- Zasoby dla wyniku 11111111-1111-1111-1111-111111111111
('a1b2c3d4-e5f6-7890-a1b2-c3d4e5f6a7b8', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', '11111111-1111-1111-1111-111111111111', 'https://example.com/images/banner.jpg', 'image', 250000, 'image/jpeg', 120, true, 'cache-first', 
'{"compression": "jpeg", "dimensions": "1200x600", "color_depth": "24bit"}'),

('b2c3d4e5-f6a7-b890-c2d3-e4f5a6b7c8d9', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', '11111111-1111-1111-1111-111111111111', 'https://example.com/images/logo.png', 'image', 50000, 'image/png', 60, true, 'cache-first', 
'{"compression": "png", "dimensions": "200x100", "color_depth": "32bit"}'),

-- Zasoby dla wyniku 22222222-2222-2222-2222-222222222222
('c3d4e5f6-a7b8-c9d0-e3f4-a5b6c7d8e9f0', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', '22222222-2222-2222-2222-222222222222', 'https://example.com/images/banner.jpg', 'image', 250000, 'image/jpeg', 150, false, 'network-first', 
'{"compression": "jpeg", "dimensions": "1200x600", "color_depth": "24bit"}'),

('d4e5f6a7-b8c9-d0e1-f4a5-b6c7d8e9f0a1', 'f1e2d3c4-b5a6-7890-1234-567890abcdef', '22222222-2222-2222-2222-222222222222', 'https://example.com/images/logo.png', 'image', 50000, 'image/png', 85, false, 'network-first', 
'{"compression": "png", "dimensions": "200x100", "color_depth": "32bit"}'),

-- Zasoby dla wyniku 55555555-5555-5555-5555-555555555555
('e5f6a7b8-c9d0-e1f2-a5b6-c7d8e9f0a1b2', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '55555555-5555-5555-5555-555555555555', 'https://example.com/js/main.js', 'script', 120000, 'application/javascript', 80, true, 'cache-first', 
'{"minified": true, "async": true, "defer": false}'),

('f6a7b8c9-d0e1-f2a3-b6c7-d8e9f0a1b2c3', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '55555555-5555-5555-5555-555555555555', 'https://example.com/js/vendor.js', 'script', 350000, 'application/javascript', 130, true, 'cache-first', 
'{"minified": true, "async": false, "defer": true}'),

-- Zasoby dla wyniku 77777777-7777-7777-7777-777777777777
('a7b8c9d0-e1f2-a3b4-c7d8-e9f0a1b2c3d4', '9f8e7d6c-5b4a-3210-fedc-ba9876543210', '77777777-7777-7777-7777-777777777777', 'https://example.com/css/main.css', 'stylesheet', 75000, 'text/css', 70, true, 'cache-first', 
'{"minified": true, "media": "all", "imports": 2}'),

('b8c9d0e1-f2a3-b4c5-d8e9-f0a1b2c3d4e5', '9f8e7d6c-5b4a-3210-fedc-ba9876543210', '77777777-7777-7777-7777-777777777777', 'https://example.com/css/responsive.css', 'stylesheet', 45000, 'text/css', 55, true, 'cache-first', 
'{"minified": true, "media": "screen", "imports": 0}');

-- Dodanie powiązań test-tag
INSERT INTO public.test_tags (test_id, tag_id) VALUES
('11111111-1111-1111-1111-111111111111', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'),  -- cache-first + pierwszy wynik
('11111111-1111-1111-1111-111111111111', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'),  -- images + pierwszy wynik
('11111111-1111-1111-1111-111111111111', '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'),  -- good + pierwszy wynik

('22222222-2222-2222-2222-222222222222', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e'),  -- network-first + drugi wynik
('22222222-2222-2222-2222-222222222222', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b'),  -- images + drugi wynik
('22222222-2222-2222-2222-222222222222', '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e'),  -- good + drugi wynik

('55555555-5555-5555-5555-555555555555', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'),  -- cache-first + piąty wynik
('55555555-5555-5555-5555-555555555555', '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c'),  -- scripts + piąty wynik
('55555555-5555-5555-5555-555555555555', '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f'),  -- slow + piąty wynik

('77777777-7777-7777-7777-777777777777', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'),  -- cache-first + siódmy wynik
('77777777-7777-7777-7777-777777777777', '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d'),  -- stylesheets + siódmy wynik
('77777777-7777-7777-7777-777777777777', '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a');  -- offline + siódmy wynik 