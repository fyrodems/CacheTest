import { z } from 'zod';
import type { APIRoute } from 'astro';
import { TestResultsService } from '../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Schema walidacji parametrów zapytania
const querySchema = z.object({
  category: z.string().optional()
});

/**
 * Pobiera listę wszystkich dostępnych tagów
 *
 * @param category - Opcjonalne filtrowanie po kategorii
 * @returns Lista dostępnych tagów
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
    
    const { category } = queryParamsResult.data;
    
    // 2. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Pobierz tagi z opcjonalnym filtrowaniem po kategorii
    const { data, error } = await TestResultsService.getTags(supabase, category);
    
    if (error) {
      console.error('Error fetching tags:', error);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 4. Zwróć listę tagów
    return new Response(
      JSON.stringify({ data: data || [] }),
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