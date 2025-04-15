import { z } from 'zod';
import type { APIRoute } from 'astro';
import { TestResultsService } from '../../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Schema walidacji parametrów zapytania
const querySchema = z.object({
  format: z.enum(['csv', 'json']).default('json'),
  include_resources: z.union([
    z.literal('true').transform(() => true),
    z.literal('false').transform(() => false),
    z.boolean()
  ]).default(false)
});

// Schema walidacji ID
const idSchema = z.string().uuid({
  message: "Invalid test result ID format. UUID expected."
});

/**
 * Eksportuje dane wyniku testu w określonym formacie
 *
 * @param params.id - UUID wyniku testu
 * @param format - Format eksportu (csv, json)
 * @param include_resources - Czy dołączyć metryki zasobów
 * @returns Plik do pobrania w żądanym formacie
 */
export const GET: APIRoute = async ({ params, locals, request }) => {
  try {
    // 1. Walidacja ID
    const validationResult = idSchema.safeParse(params.id);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const id = validationResult.data;
    
    // 2. Walidacja parametrów zapytania
    const url = new URL(request.url);
    const rawQueryParams = Object.fromEntries(url.searchParams);
    
    const queryParamsResult = querySchema.safeParse(rawQueryParams);
    if (!queryParamsResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid query parameters", details: queryParamsResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { format, include_resources } = queryParamsResult.data;
    
    // 3. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 4. Wywołanie serwisu dla eksportu wyniku testu
    const { data, error, contentType } = await TestResultsService.exportTestResult(
      supabase, 
      id, 
      format, 
      include_resources
    );
    
    // 5. Obsługa błędów
    if (error) {
      if (error.code === 'PGRST116') {
        // Błąd "row not found" z postgREST
        return new Response(
          JSON.stringify({ error: "Test result not found." }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Błąd autoryzacji
      if (error.code === 'PGRST109') {
        return new Response(
          JSON.stringify({ error: "Access denied to this test result." }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Error during export:', error);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: "No data available for export." }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 6. Przygotowanie odpowiedzi z odpowiednimi nagłówkami do pobrania pliku
    const filename = `test-result-${id}.${format}`;
    
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store'
      }
    });
    
  } catch (error) {
    console.error('Unexpected error during export:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 