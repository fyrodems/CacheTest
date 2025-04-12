-- ----------------------------------------------------------------------------
-- Migration: create_cachetest_schema
-- Description: Initial schema setup for CacheTest PWA application
-- 
-- This migration creates the following tables:
-- - users: user accounts for the application
-- - test_sessions: information about testing sessions
-- - test_results: detailed results for each caching strategy test
-- - environment_info: browser and system details for tests
-- - network_conditions: simulated network conditions for tests
-- - resource_metrics: metrics for resources loaded during tests
-- - tags: categorization tags for tests
-- - test_tags: many-to-many relation between tests and tags
--
-- In addition, it sets up Row Level Security (RLS) policies to ensure
-- users can only access their own data, implements proper indexes for
-- efficient queries, and configures relationships between tables.
-- ----------------------------------------------------------------------------

-- enable uuid extension if not already enabled
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- users table 
-- stores basic information about application users
-- ----------------------------------------------------------------------------
create table users (
    id uuid primary key default uuid_generate_v4(),
    email text not null unique,
    auth_provider text not null,
    auth_id text not null,
    created_at timestamp with time zone not null default now(),
    last_login timestamp with time zone
);

-- enable row level security for users table
alter table users enable row level security;

-- create indexes on users table
create index idx_users_email on users(email);
create index idx_users_auth on users(auth_provider, auth_id);

-- ----------------------------------------------------------------------------
-- test_sessions table
-- stores information about testing sessions
-- ----------------------------------------------------------------------------
create table test_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references users(id) on delete cascade,
    name text not null,
    description text,
    created_at timestamp with time zone not null default now(),
    duration interval
);

-- enable row level security for test_sessions table
alter table test_sessions enable row level security;

-- create indexes on test_sessions table
create index idx_test_sessions_user_id on test_sessions(user_id);
create index idx_test_sessions_created_at on test_sessions(created_at);

-- ----------------------------------------------------------------------------
-- test_results table
-- stores detailed results for each caching strategy test
-- ----------------------------------------------------------------------------
create table test_results (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references test_sessions(id) on delete cascade,
    strategy_type text not null,
    fp numeric,           -- first paint (ms)
    fcp numeric,          -- first contentful paint (ms)
    tti numeric,          -- time to interactive (ms)
    lcp numeric,          -- largest contentful paint (ms)
    fid numeric,          -- first input delay (ms)
    ttfb numeric,         -- time to first byte (ms)
    offline_availability boolean,
    timestamp_start timestamp with time zone not null default now(),
    timestamp_end timestamp with time zone,
    raw_metrics jsonb     -- additional metrics in json format
);

-- enable row level security for test_results table
alter table test_results enable row level security;

-- create indexes on test_results table
create index idx_test_results_session_id on test_results(session_id);
create index idx_test_results_strategy_type on test_results(strategy_type);
create index idx_test_results_timestamp_start on test_results(timestamp_start);
create index idx_test_results_metrics on test_results(fp, fcp, tti, lcp, fid, ttfb);

-- ----------------------------------------------------------------------------
-- environment_info table
-- stores information about the testing environment
-- ----------------------------------------------------------------------------
create table environment_info (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references test_sessions(id) on delete cascade,
    browser text not null,
    browser_version text not null,
    os text not null,
    os_version text not null,
    device_type text,
    additional_info jsonb
);

-- enable row level security for environment_info table
alter table environment_info enable row level security;

-- create indexes on environment_info table
create index idx_environment_info_session_id on environment_info(session_id);
create index idx_environment_info_browser on environment_info(browser, browser_version);
create index idx_environment_info_os on environment_info(os, os_version);

-- ----------------------------------------------------------------------------
-- network_conditions table
-- stores information about simulated network conditions
-- ----------------------------------------------------------------------------
create table network_conditions (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references test_sessions(id) on delete cascade,
    condition_type text not null,  -- good, slow, flaky, offline
    latency integer,               -- latency in ms
    bandwidth integer,             -- bandwidth in kbps
    packet_loss numeric,           -- packet loss in %
    additional_config jsonb        -- additional configuration as json
);

-- enable row level security for network_conditions table
alter table network_conditions enable row level security;

-- create indexes on network_conditions table
create index idx_network_conditions_session_id on network_conditions(session_id);
create index idx_network_conditions_type on network_conditions(condition_type);

-- ----------------------------------------------------------------------------
-- resource_metrics table
-- stores detailed information about resources tested during sessions
-- ----------------------------------------------------------------------------
create table resource_metrics (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid not null references test_sessions(id) on delete cascade,
    result_id uuid references test_results(id) on delete cascade,
    resource_url text not null,
    resource_type text not null,    -- image, css, js, font, etc.
    size integer,                   -- size in bytes
    mime_type text,
    load_time numeric,              -- load time in ms
    cache_hit boolean,              -- whether the resource was loaded from cache
    strategy_used text,             -- strategy used for this resource
    additional_metrics jsonb        -- additional metrics in json format
);

-- enable row level security for resource_metrics table
alter table resource_metrics enable row level security;

-- create indexes on resource_metrics table
create index idx_resource_metrics_session_id on resource_metrics(session_id);
create index idx_resource_metrics_result_id on resource_metrics(result_id);
create index idx_resource_metrics_resource_type on resource_metrics(resource_type);
create index idx_resource_metrics_cache_hit on resource_metrics(cache_hit);

-- ----------------------------------------------------------------------------
-- tags table
-- stores available tags for categorizing tests
-- ----------------------------------------------------------------------------
create table tags (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    category text not null    -- strategy, resource, network
);

-- enable row level security for tags table
alter table tags enable row level security;

-- ----------------------------------------------------------------------------
-- test_tags table
-- junction table for many-to-many relation between tests and tags
-- ----------------------------------------------------------------------------
create table test_tags (
    test_id uuid not null references test_results(id) on delete cascade,
    tag_id uuid not null references tags(id) on delete cascade,
    primary key (test_id, tag_id)
);

-- enable row level security for test_tags table
alter table test_tags enable row level security;

-- create indexes on test_tags table
create index idx_test_tags_test_id on test_tags(test_id);
create index idx_test_tags_tag_id on test_tags(tag_id);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- These policies control access to the tables based on user authentication
-- ----------------------------------------------------------------------------

-- ----------------------------------------------------------------------------
-- RLS policies for users table
-- ----------------------------------------------------------------------------

-- users can select only their own data
create policy users_select_anon on users
    for select to anon
    using (false);  -- anon users can't access any user data

create policy users_select_auth on users
    for select to authenticated
    using (auth.uid() = id);  -- users can only see their own profile

-- users can update only their own data
create policy users_update_anon on users
    for update to anon
    using (false);  -- anon users can't update any user data

create policy users_update_auth on users
    for update to authenticated
    using (auth.uid() = id);  -- users can only update their own profile

-- ----------------------------------------------------------------------------
-- RLS policies for test_sessions table
-- ----------------------------------------------------------------------------

-- anon users have no access to test sessions
create policy test_sessions_select_anon on test_sessions
    for select to anon
    using (false);

-- authenticated users can select only their own test sessions
create policy test_sessions_select_auth on test_sessions
    for select to authenticated
    using (user_id = auth.uid());

-- anon users cannot insert test sessions
create policy test_sessions_insert_anon on test_sessions
    for insert to anon
    with check (false);

-- authenticated users can insert test sessions where they are the owner
create policy test_sessions_insert_auth on test_sessions
    for insert to authenticated
    with check (user_id = auth.uid());

-- anon users cannot update test sessions
create policy test_sessions_update_anon on test_sessions
    for update to anon
    using (false);

-- authenticated users can update only their own test sessions
create policy test_sessions_update_auth on test_sessions
    for update to authenticated
    using (user_id = auth.uid());

-- anon users cannot delete test sessions
create policy test_sessions_delete_anon on test_sessions
    for delete to anon
    using (false);

-- authenticated users can delete only their own test sessions
create policy test_sessions_delete_auth on test_sessions
    for delete to authenticated
    using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- RLS policies for test_results table
-- ----------------------------------------------------------------------------

-- anon users have no access to test results
create policy test_results_select_anon on test_results
    for select to anon
    using (false);

-- authenticated users can select test results only for their sessions
create policy test_results_select_auth on test_results
    for select to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot insert test results
create policy test_results_insert_anon on test_results
    for insert to anon
    with check (false);

-- authenticated users can insert test results only for their sessions
create policy test_results_insert_auth on test_results
    for insert to authenticated
    with check (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot update test results
create policy test_results_update_anon on test_results
    for update to anon
    using (false);

-- authenticated users can update test results only for their sessions
create policy test_results_update_auth on test_results
    for update to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot delete test results
create policy test_results_delete_anon on test_results
    for delete to anon
    using (false);

-- authenticated users can delete test results only for their sessions
create policy test_results_delete_auth on test_results
    for delete to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- RLS policies for environment_info table
-- ----------------------------------------------------------------------------

-- anon users have no access to environment information
create policy environment_info_select_anon on environment_info
    for select to anon
    using (false);

-- authenticated users can select environment information only for their sessions
create policy environment_info_select_auth on environment_info
    for select to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot insert environment information
create policy environment_info_insert_anon on environment_info
    for insert to anon
    with check (false);

-- authenticated users can insert environment information only for their sessions
create policy environment_info_insert_auth on environment_info
    for insert to authenticated
    with check (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot update environment information
create policy environment_info_update_anon on environment_info
    for update to anon
    using (false);

-- authenticated users can update environment information only for their sessions
create policy environment_info_update_auth on environment_info
    for update to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot delete environment information
create policy environment_info_delete_anon on environment_info
    for delete to anon
    using (false);

-- authenticated users can delete environment information only for their sessions
create policy environment_info_delete_auth on environment_info
    for delete to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- RLS policies for network_conditions table
-- ----------------------------------------------------------------------------

-- anon users have no access to network conditions
create policy network_conditions_select_anon on network_conditions
    for select to anon
    using (false);

-- authenticated users can select network conditions only for their sessions
create policy network_conditions_select_auth on network_conditions
    for select to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot insert network conditions
create policy network_conditions_insert_anon on network_conditions
    for insert to anon
    with check (false);

-- authenticated users can insert network conditions only for their sessions
create policy network_conditions_insert_auth on network_conditions
    for insert to authenticated
    with check (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot update network conditions
create policy network_conditions_update_anon on network_conditions
    for update to anon
    using (false);

-- authenticated users can update network conditions only for their sessions
create policy network_conditions_update_auth on network_conditions
    for update to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot delete network conditions
create policy network_conditions_delete_anon on network_conditions
    for delete to anon
    using (false);

-- authenticated users can delete network conditions only for their sessions
create policy network_conditions_delete_auth on network_conditions
    for delete to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- RLS policies for resource_metrics table
-- ----------------------------------------------------------------------------

-- anon users have no access to resource metrics
create policy resource_metrics_select_anon on resource_metrics
    for select to anon
    using (false);

-- authenticated users can select resource metrics only for their sessions
create policy resource_metrics_select_auth on resource_metrics
    for select to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot insert resource metrics
create policy resource_metrics_insert_anon on resource_metrics
    for insert to anon
    with check (false);

-- authenticated users can insert resource metrics only for their sessions
create policy resource_metrics_insert_auth on resource_metrics
    for insert to authenticated
    with check (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot update resource metrics
create policy resource_metrics_update_anon on resource_metrics
    for update to anon
    using (false);

-- authenticated users can update resource metrics only for their sessions
create policy resource_metrics_update_auth on resource_metrics
    for update to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- anon users cannot delete resource metrics
create policy resource_metrics_delete_anon on resource_metrics
    for delete to anon
    using (false);

-- authenticated users can delete resource metrics only for their sessions
create policy resource_metrics_delete_auth on resource_metrics
    for delete to authenticated
    using (session_id in (select id from test_sessions where user_id = auth.uid()));

-- ----------------------------------------------------------------------------
-- RLS policies for tags table
-- ----------------------------------------------------------------------------

-- both anon and authenticated users can select tags (public information)
create policy tags_select_anon on tags
    for select to anon
    using (true);

create policy tags_select_auth on tags
    for select to authenticated
    using (true);

-- only authenticated users can insert/update/delete tags
create policy tags_insert_anon on tags
    for insert to anon
    with check (false);

create policy tags_insert_auth on tags
    for insert to authenticated
    with check (true);

create policy tags_update_anon on tags
    for update to anon
    using (false);

create policy tags_update_auth on tags
    for update to authenticated
    using (true);

create policy tags_delete_anon on tags
    for delete to anon
    using (false);

create policy tags_delete_auth on tags
    for delete to authenticated
    using (true);

-- ----------------------------------------------------------------------------
-- RLS policies for test_tags table
-- ----------------------------------------------------------------------------

-- anon users have no access to test tags
create policy test_tags_select_anon on test_tags
    for select to anon
    using (false);

-- authenticated users can select test tags only for their tests
create policy test_tags_select_auth on test_tags
    for select to authenticated
    using (test_id in (
        select tr.id 
        from test_results tr
        join test_sessions ts on tr.session_id = ts.id
        where ts.user_id = auth.uid()
    ));

-- anon users cannot insert test tags
create policy test_tags_insert_anon on test_tags
    for insert to anon
    with check (false);

-- authenticated users can insert test tags only for their tests
create policy test_tags_insert_auth on test_tags
    for insert to authenticated
    with check (test_id in (
        select tr.id 
        from test_results tr
        join test_sessions ts on tr.session_id = ts.id
        where ts.user_id = auth.uid()
    ));

-- anon users cannot delete test tags
create policy test_tags_delete_anon on test_tags
    for delete to anon
    using (false);

-- authenticated users can delete test tags only for their tests
create policy test_tags_delete_auth on test_tags
    for delete to authenticated
    using (test_id in (
        select tr.id 
        from test_results tr
        join test_sessions ts on tr.session_id = ts.id
        where ts.user_id = auth.uid()
    ));

-- ----------------------------------------------------------------------------
-- Initial data setup: create default tags
-- ----------------------------------------------------------------------------

-- strategy tags
insert into tags (name, category) values
    ('network-first', 'strategy'),
    ('cache-first', 'strategy'),
    ('stale-while-revalidate', 'strategy'),
    ('cache-then-network', 'strategy');

-- resource type tags
insert into tags (name, category) values
    ('image', 'resource'),
    ('css', 'resource'),
    ('javascript', 'resource'),
    ('font', 'resource'),
    ('html', 'resource'),
    ('other', 'resource');

-- network condition tags
insert into tags (name, category) values
    ('good', 'network'),
    ('slow', 'network'),
    ('flaky', 'network'),
    ('offline', 'network'); 