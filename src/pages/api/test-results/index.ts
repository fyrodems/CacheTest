import { z } from 'zod';
import type { APIRoute } from 'astro';
import { TestResultsService } from '../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Schema walidacji parametrów zapytania dla GET
const querySchema = z.object({
  session_id: z.string().uuid().optional(),
  strategy_type: z.enum(['network-first', 'cache-first', 'stale-while-revalidate', 'cache-then-network']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().default('timestamp_start'),
  order: z.enum(['asc', 'desc']).default('desc')
});

// Schema walidacji dla ciała POST
const createTestResultSchema = z.object({
  session_id: z.string().uuid(),
  strategy_type: z.enum(['network-first', 'cache-first', 'stale-while-revalidate', 'cache-then-network']),
  fp: z.number().nullable().optional(),
  fcp: z.number().nullable().optional(),
  tti: z.number().nullable().optional(),
  lcp: z.number().nullable().optional(),
  fid: z.number().nullable().optional(),
  ttfb: z.number().nullable().optional(),
  offline_availability: z.boolean().nullable().optional(),
  raw_metrics: z.any().optional(),
  timestamp_start: z.string().optional()
});

/**
 * Pobiera listę wyników testów z opcjonalnym filtrowaniem i paginacją
 *
 * @param session_id - Opcjonalne filtrowanie po ID sesji
 * @param strategy_type - Opcjonalne filtrowanie po typie strategii
 * @param page - Numer strony (domyślnie 1)
 * @param limit - Liczba wyników na stronę (domyślnie 10, maksymalnie 100)
 * @param sort - Pole do sortowania (domyślnie timestamp_start)
 * @param order - Kierunek sortowania (asc/desc, domyślnie desc)
 * @returns Lista wyników testów z informacją o paginacji
 */
export const GET: APIRoute = async ({ locals, request }) => {
  try {
    // 1. Walidacja parametrów zapytania
    const url = new URL(request.url);
    const rawQueryParams = Object.fromEntries(url.searchParams);
    
    const queryParamsResult = querySchema.safeParse(rawQueryParams);
    if (!queryParamsResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid query parameters", 
          details: queryParamsResult.error.format() 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const params = queryParamsResult.data;
    
    // 2. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Wywołanie serwisu do pobrania wyników testów
    const { data, error } = await TestResultsService.getTestResults(supabase, {
      session_id: params.session_id,
      strategy_type: params.strategy_type,
      page: params.page,
      limit: params.limit,
      sort: params.sort,
      order: params.order
    });
    
    // 4. Obsługa błędów
    if (error) {
      console.error('Error fetching test results:', error);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch test results." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 5. Zwrócenie listy wyników testów z informacją o paginacji
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

/**
 * Tworzy nowy wynik testu
 *
 * @param session_id - ID sesji testowej
 * @param strategy_type - Typ strategii cache'owania
 * @param fp - First Paint (ms)
 * @param fcp - First Contentful Paint (ms)
 * @param tti - Time to Interactive (ms)
 * @param lcp - Largest Contentful Paint (ms)
 * @param fid - First Input Delay (ms)
 * @param ttfb - Time to First Byte (ms)
 * @param offline_availability - Dostępność offline
 * @param raw_metrics - Dodatkowe metryki w formacie JSON
 * @returns Utworzony wynik testu
 */
export const POST: APIRoute = async ({ locals, request }) => {
  try {
    // 1. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 2. Parsowanie ciała żądania
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Walidacja danych wejściowych
    const validationResult = createTestResultSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body", 
          details: validationResult.error.format() 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const testResultData = validationResult.data;
    
    // 4. Sprawdzenie, czy sesja istnieje i należy do użytkownika
    const { data: sessionExists, error: sessionError } = await supabase
      .from('test_sessions')
      .select('id')
      .eq('id', testResultData.session_id)
      .single();
    
    if (sessionError || !sessionExists) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid session ID or you don't have access to this session." 
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 5. Utworzenie nowego wyniku testu
    const { data, error } = await TestResultsService.createTestResult(supabase, testResultData);
    
    if (error) {
      console.error('Error creating test result:', error);
      
      // Błąd unikalności (już istnieje wynik z tym samym ID sesji i strategią)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ 
            error: "A test result with this session ID and strategy type already exists." 
          }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to create test result." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 6. Zwrócenie utworzonego wyniku testu
    return new Response(
      JSON.stringify(data),
      { 
        status: 201, 
        headers: { 
          'Content-Type': 'application/json',
          'Location': `/api/test-results/${data?.id}`
        } 
      }
    );
    
  } catch (error) {
    console.error('Unexpected error creating test result:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 