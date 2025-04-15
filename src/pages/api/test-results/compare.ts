import { z } from 'zod';
import type { APIRoute } from 'astro';
import { TestResultsService } from '../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Schema walidacji parametrów zapytania
const querySchema = z.object({
  ids: z.string()
    .transform(val => val.split(',').filter(id => id.trim().length > 0))
    .refine(ids => ids.length > 0, {
      message: 'At least one test result ID must be provided'
    })
});

/**
 * Porównuje wyniki testów na podstawie listy ID
 *
 * @param ids - Lista ID wyników testów do porównania (oddzielone przecinkami)
 * @returns Dane porównawcze dla wyników testów
 */
export const GET: APIRoute = async ({ locals, request }) => {
  try {
    // 1. Walidacja parametrów zapytania
    const url = new URL(request.url);
    const rawQueryParams = Object.fromEntries(url.searchParams);
    
    const queryParamsResult = querySchema.safeParse(rawQueryParams);
    if (!queryParamsResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid query parameters", details: queryParamsResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { ids } = queryParamsResult.data;
    
    // 2. Dodatkowa walidacja ID - sprawdzenie formatu UUID dla każdego ID
    const uuidSchema = z.string().uuid();
    const invalidIds = ids.filter(id => !uuidSchema.safeParse(id).success);
    
    if (invalidIds.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid test result ID format", 
          details: `The following IDs are not valid UUIDs: ${invalidIds.join(', ')}` 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 4. Wywołanie serwisu do porównania wyników testów
    const { data, error } = await TestResultsService.compareTestResults(supabase, ids);
    
    // 5. Obsługa błędów
    if (error) {
      console.error('Error comparing test results:', error);
      
      // Sprawdź, czy to jest error z brakującymi wynikami
      if (error.message && (
        error.message.includes('No test result IDs provided') || 
        error.message.includes('No test results found')
      )) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({ error: "Failed to compare test results." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 6. Zwrócenie wyniku porównania
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error during comparison:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 