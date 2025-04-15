import { z } from 'zod';
import type { APIRoute } from 'astro';
import type { TestResultResponseDTO } from '../../../types';
import { TestResultsService } from '../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Zdefiniowanie schematu walidacji
const idSchema = z.string().uuid({
  message: "Invalid test result ID format. UUID expected."
});

/**
 * Pobiera szczegółowe informacje o wyniku testu na podstawie jego ID
 *
 * @param params.id - UUID wyniku testu
 * @returns TestResultResponseDTO | error response
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
    
    // 2. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Wywołanie serwisu do pobrania wyniku testu
    const { data, error } = await TestResultsService.getTestResultById(supabase, id);
    
    // 4. Obsługa błędów
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
      
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 5. Zwrócenie wyniku
    return new Response(
      JSON.stringify(data as TestResultResponseDTO),
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