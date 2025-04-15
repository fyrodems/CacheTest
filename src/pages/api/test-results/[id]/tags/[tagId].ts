import { z } from 'zod';
import type { APIRoute } from 'astro';
import { TestResultsService } from '../../../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Schema walidacji ID
const idSchema = z.string().uuid({
  message: "Invalid ID format. UUID expected."
});

/**
 * Usuwa tag z wyniku testu
 *
 * @param params.id - UUID wyniku testu
 * @param params.tagId - UUID tagu do usunięcia
 * @returns Status operacji
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    // 1. Walidacja ID wyniku testu i tagu
    const testIdResult = idSchema.safeParse(params.id);
    const tagIdResult = idSchema.safeParse(params.tagId);
    
    if (!testIdResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid test result ID format." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!tagIdResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid tag ID format." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const testId = testIdResult.data;
    const tagId = tagIdResult.data;
    
    // 2. Pobranie klienta Supabase z kontekstu
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 3. Najpierw sprawdź, czy wynik testu istnieje i należy do użytkownika
    const { data: testResult, error: testError } = await TestResultsService.getTestResultById(supabase, testId);
    
    if (testError) {
      if (testError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: "Test result not found." }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Database error:', testError);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!testResult) {
      return new Response(
        JSON.stringify({ error: "Test result not found." }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 4. Sprawdź, czy tag jest przypisany do wyniku testu
    const { data: tagExists, error: tagCheckError } = await supabase
      .from('test_tags')
      .select('test_id')
      .eq('test_id', testId)
      .eq('tag_id', tagId)
      .single();
    
    if (tagCheckError && tagCheckError.code === 'PGRST116') {
      return new Response(
        JSON.stringify({ error: "Tag is not assigned to this test result." }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (tagCheckError) {
      console.error('Error checking tag assignment:', tagCheckError);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 5. Usuń tag z wyniku testu
    const { success, error } = await TestResultsService.removeTagFromTestResult(supabase, testId, tagId);
    
    if (error) {
      console.error('Error removing tag from test result:', error);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 6. Zwróć status operacji
    return new Response(
      JSON.stringify({ success }),
      { status: 204, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 