import { z } from 'zod';
import type { APIRoute } from 'astro';
import { TestResultsService } from '../../../../lib/services/test-results.service';

// Wyłączenie prerenderowania - endpoint dynamiczny
export const prerender = false;

// Schema walidacji ID
const idSchema = z.string().uuid({
  message: "Invalid test result ID format. UUID expected."
});

// Schema walidacji dla ciała POST
const addTagsSchema = z.object({
  tag_ids: z.array(z.string().uuid())
    .min(1, "At least one tag ID must be provided")
});

/**
 * Pobiera tagi przypisane do wyniku testu
 *
 * @param params.id - UUID wyniku testu
 * @returns Lista tagów przypisanych do wyniku testu
 */
export const GET: APIRoute = async ({ params, locals }) => {
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
    
    // 3. Najpierw sprawdź, czy wynik testu istnieje i należy do użytkownika
    const { data: testResult, error: testError } = await TestResultsService.getTestResultById(supabase, id);
    
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
    
    // 4. Pobierz tagi dla wyniku testu
    const { data, error } = await TestResultsService.getTestResultTags(supabase, id);
    
    if (error) {
      console.error('Error fetching test result tags:', error);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 5. Zwróć tagi przypisane do wyniku testu
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
 * Dodaje tagi do wyniku testu
 *
 * @param params.id - UUID wyniku testu
 * @param tag_ids - Lista ID tagów do dodania
 * @returns Lista zaktualizowanych tagów przypisanych do wyniku testu
 */
export const POST: APIRoute = async ({ params, locals, request }) => {
  try {
    // 1. Walidacja ID wyniku testu
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
    
    // 3. Parsowanie ciała żądania
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 4. Walidacja danych wejściowych
    const addTagsResult = addTagsSchema.safeParse(requestBody);
    if (!addTagsResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid request body", 
          details: addTagsResult.error.format() 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { tag_ids } = addTagsResult.data;
    
    // 5. Najpierw sprawdź, czy wynik testu istnieje i należy do użytkownika
    const { data: testResult, error: testError } = await TestResultsService.getTestResultById(supabase, id);
    
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
    
    // 6. Sprawdź, czy tagi istnieją
    const { data: tagsExist, error: tagsError } = await supabase
      .from('tags')
      .select('id')
      .in('id', tag_ids);
    
    if (tagsError) {
      console.error('Error verifying tags:', tagsError);
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const existingTagIds = tagsExist?.map(tag => tag.id) || [];
    const missingTagIds = tag_ids.filter(id => !existingTagIds.includes(id));
    
    if (missingTagIds.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: "Some tags do not exist", 
          details: { missing_tag_ids: missingTagIds } 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 7. Dodaj tagi do wyniku testu
    const { data, error } = await TestResultsService.addTagsToTestResult(supabase, id, tag_ids);
    
    if (error) {
      console.error('Error adding tags to test result:', error);
      
      // Błąd unikalności (tag już jest przypisany do tego wyniku)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: "Some tags are already assigned to this test result." }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Internal server error." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 8. Zwróć zaktualizowane tagi
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