/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  TestResultResponseDTO,
  TestResultListResponseDTO,
  CreateTestResultDTO,
  TestResultComparisonResponseDTO,
  // TestResultMetricsDTO,
  TagResponseDTO,
  TestResultTagsResponseDTO,
} from "../../types";

/**
 * Serwis obsługujący operacje dotyczące wyników testów
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TestResultsService {
  /**
   * Pobiera szczegółowe informacje o wyniku testu na podstawie jego ID
   *
   * @param supabase - Klient Supabase
   * @param id - UUID wyniku testu
   * @returns TestResultResponseDTO lub błąd
   */
  public static async getTestResultById(
    supabase: SupabaseClient<Database>,
    id: string,
  ): Promise<{ data: TestResultResponseDTO | null; error: any }> {
    try {
      // Zapytanie do bazy danych (RLS automatycznie filtruje dostęp)
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("id", id)
        .single();

      return { data: data as TestResultResponseDTO, error };
    } catch (error) {
      console.error("Error fetching test result:", error);
      return { data: null, error };
    }
  }

  /**
   * Pobiera listę wyników testów z opcjonalnym filtrowaniem i paginacją
   *
   * @param supabase - Klient Supabase
   * @param options - Opcje filtrowania i paginacji
   * @returns Lista wyników testów
   */
  public static async getTestResults(
    supabase: SupabaseClient<Database>,
    options: {
      session_id?: string;
      strategy_type?: string;
      page?: number;
      limit?: number;
      sort?: string;
      order?: "asc" | "desc";
    },
  ): Promise<{
    data: TestResultListResponseDTO | null;
    error: any;
  }> {
    try {
      const {
        session_id,
        strategy_type,
        page = 1,
        limit = 10,
        sort = "timestamp_start",
        order = "desc",
      } = options;

      // Rozpocznij zapytanie
      let query = supabase.from("test_results").select("*", { count: "exact" });

      // Dodaj filtry, jeśli są dostarczone
      if (session_id) {
        query = query.eq("session_id", session_id);
      }

      if (strategy_type) {
        query = query.eq("strategy_type", strategy_type);
      }

      // Dodaj sortowanie i paginację
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        .order(sort, { ascending: order === "asc" })
        .range(from, to);

      if (error) {
        return { data: null, error };
      }

      // Obliczanie informacji o paginacji
      const totalPages = count ? Math.ceil(count / limit) : 0;

      const result: TestResultListResponseDTO = {
        data: data as TestResultResponseDTO[],
        pagination: {
          total: count || 0,
          page,
          limit,
          pages: totalPages,
        },
      };

      return { data: result, error: null };
    } catch (error) {
      console.error("Error fetching test results:", error);
      return { data: null, error };
    }
  }

  /**
   * Tworzy nowy wynik testu
   *
   * @param supabase - Klient Supabase
   * @param testResult - Dane nowego wyniku testu
   * @returns Utworzony wynik testu lub błąd
   */
  public static async createTestResult(
    supabase: SupabaseClient<Database>,
    testResult: CreateTestResultDTO,
  ): Promise<{ data: TestResultResponseDTO | null; error: any }> {
    try {
      // Ustaw datę rozpoczęcia testu, jeśli nie została podana
      const dataToInsert = {
        ...testResult,
        timestamp_start: testResult.timestamp_start || new Date().toISOString(),
      };

      // Dodaj nowy wynik testu do bazy danych
      const { data, error } = await supabase
        .from("test_results")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as TestResultResponseDTO, error: null };
    } catch (error) {
      console.error("Error creating test result:", error);
      return { data: null, error };
    }
  }

  /**
   * Dodaje tagi do wyniku testu
   *
   * @param supabase - Klient Supabase
   * @param testId - ID wyniku testu
   * @param tagIds - Lista ID tagów do dodania
   * @returns Informacja o tagach przypisanych do wyniku testu
   */
  public static async addTagsToTestResult(
    supabase: SupabaseClient<Database>,
    testId: string,
    tagIds: string[],
  ): Promise<{ data: TestResultTagsResponseDTO | null; error: any }> {
    try {
      if (!tagIds.length) {
        return {
          data: { test_id: testId, tags: [] },
          error: null,
        };
      }

      // Przygotuj dane do wstawienia
      const tagsToInsert = tagIds.map((tagId) => ({
        test_id: testId,
        tag_id: tagId,
      }));

      // Dodaj powiązania między testem a tagami
      const { error } = await supabase.from("test_tags").insert(tagsToInsert);

      if (error) {
        return { data: null, error };
      }

      // Pobierz zaktualizowaną listę tagów dla tego wyniku testu
      const { data, error: fetchError } = await this.getTestResultTags(
        supabase,
        testId,
      );

      if (fetchError) {
        return { data: null, error: fetchError };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error adding tags to test result:", error);
      return { data: null, error };
    }
  }

  /**
   * Pobiera tagi przypisane do wyniku testu
   *
   * @param supabase - Klient Supabase
   * @param testId - ID wyniku testu
   * @returns Lista tagów przypisanych do wyniku testu
   */
  public static async getTestResultTags(
    supabase: SupabaseClient<Database>,
    testId: string,
  ): Promise<{ data: TestResultTagsResponseDTO | null; error: any }> {
    try {
      // Pobierz tagi przypisane do wyniku testu
      const { data, error } = await supabase
        .from("test_tags")
        .select(
          `
          tag_id,
          tags:tag_id (id, name, category)
        `,
        )
        .eq("test_id", testId);

      if (error) {
        return { data: null, error };
      }

      // Przekształć dane do oczekiwanego formatu
      const tags = data?.map((item) => item.tags) || [];

      return {
        data: {
          test_id: testId,
          tags: tags as TagResponseDTO[],
        },
        error: null,
      };
    } catch (error) {
      console.error("Error fetching test result tags:", error);
      return { data: null, error };
    }
  }

  /**
   * Usuwa tag z wyniku testu
   *
   * @param supabase - Klient Supabase
   * @param testId - ID wyniku testu
   * @param tagId - ID tagu do usunięcia
   * @returns Informacja o powodzeniu operacji
   */
  public static async removeTagFromTestResult(
    supabase: SupabaseClient<Database>,
    testId: string,
    tagId: string,
  ): Promise<{ success: boolean; error: any }> {
    try {
      // Usuń powiązanie między testem a tagiem
      const { error } = await supabase
        .from("test_tags")
        .delete()
        .match({ test_id: testId, tag_id: tagId });

      if (error) {
        return { success: false, error };
      }

      return { success: true, error: null };
    } catch (error) {
      console.error("Error removing tag from test result:", error);
      return { success: false, error };
    }
  }

  /**
   * Pobiera wszystkie dostępne tagi z opcjonalnym filtrowaniem po kategorii
   *
   * @param supabase - Klient Supabase
   * @param category - Opcjonalna kategoria tagów do filtrowania
   * @returns Lista dostępnych tagów
   */
  public static async getTags(
    supabase: SupabaseClient<Database>,
    category?: string,
  ): Promise<{ data: TagResponseDTO[] | null; error: any }> {
    try {
      let query = supabase.from("tags").select("*");

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) {
        return { data: null, error };
      }

      return { data: data as TagResponseDTO[], error: null };
    } catch (error) {
      console.error("Error fetching tags:", error);
      return { data: null, error };
    }
  }

  /**
   * Porównuje wiele wyników testów
   *
   * @param supabase - Klient Supabase
   * @param ids - Lista ID wyników testów do porównania
   * @returns Porównanie wyników testów
   */
  public static async compareTestResults(
    supabase: SupabaseClient<Database>,
    ids: string[],
  ): Promise<{
    data: TestResultComparisonResponseDTO | null;
    error: any;
  }> {
    try {
      if (!ids.length) {
        return {
          data: null,
          error: new Error("No test result IDs provided for comparison"),
        };
      }

      // Pobierz wszystkie wyniki testów do porównania
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .in("id", ids);

      if (error) {
        return { data: null, error };
      }

      if (!data || data.length === 0) {
        return {
          data: null,
          error: new Error("No test results found for the provided IDs"),
        };
      }

      // Przekształć dane do wymaganego formatu
      const results = data.map((result) => ({
        id: result.id,
        strategy_type: result.strategy_type,
        metrics: {
          fp: result.fp,
          fcp: result.fcp,
          tti: result.tti,
          lcp: result.lcp,
          fid: result.fid,
          ttfb: result.ttfb,
          offline_availability: result.offline_availability,
        },
      }));

      // Znajdź najlepsze wyniki dla każdej metryki
      const metricsToCompare = ["fp", "fcp", "tti", "lcp", "fid", "ttfb"];
      const metricsComparison: Record<string, any> = {};

      metricsToCompare.forEach((metric) => {
        const validResults = results.filter((r) => r.metrics[metric] !== null);

        if (validResults.length === 0) {
          return;
        }

        // Dla większości metryk, niższa wartość jest lepsza
        const sortedResults = [...validResults].sort((a, b) => {
          return a.metrics[metric] - b.metrics[metric];
        });

        const bestResult = sortedResults[0];
        const diffPercentage: Record<string, number> = {};

        // Oblicz procentową różnicę w porównaniu do najlepszego wyniku
        validResults.forEach((result) => {
          const bestValue = bestResult.metrics[metric];
          const currentValue = result.metrics[metric];

          // Unikaj dzielenia przez zero
          if (bestValue === 0) {
            diffPercentage[result.id] = currentValue === 0 ? 0 : 100;
          } else {
            diffPercentage[result.id] =
              ((currentValue - bestValue) / bestValue) * 100;
          }
        });

        metricsComparison[metric] = {
          best: bestResult.id,
          diff_percentage: diffPercentage,
        };
      });

      // Określ najlepszy ogólny wynik (najmniejsza suma znormalizowanych metryk)
      let bestOverallId = results[0].id;
      let bestOverallScore = Infinity;

      results.forEach((result) => {
        let score = 0;
        let metricCount = 0;

        // Oblicz znormalizowany wynik dla każdej metryki
        metricsToCompare.forEach((metric) => {
          if (result.metrics[metric] !== null && metricsComparison[metric]) {
            score += metricsComparison[metric].diff_percentage[result.id];
            metricCount++;
          }
        });

        // Oblicz średni wynik, jeśli mamy jakieś metryki
        if (metricCount > 0) {
          const averageScore = score / metricCount;
          if (averageScore < bestOverallScore) {
            bestOverallScore = averageScore;
            bestOverallId = result.id;
          }
        }
      });

      const comparisonResult: TestResultComparisonResponseDTO = {
        results,
        comparison: {
          best_overall: bestOverallId,
          metrics_comparison: metricsComparison,
        },
      };

      return { data: comparisonResult, error: null };
    } catch (error) {
      console.error("Error comparing test results:", error);
      return { data: null, error };
    }
  }

  /**
   * Eksportuje dane wyniku testu w określonym formacie
   *
   * @param supabase - Klient Supabase
   * @param id - ID wyniku testu do eksportu
   * @param format - Format eksportu (csv, json)
   * @param includeResources - Czy dołączyć metryki zasobów
   * @returns Dane do eksportu
   */
  public static async exportTestResult(
    supabase: SupabaseClient<Database>,
    id: string,
    format: "csv" | "json",
    includeResources: boolean,
  ): Promise<{
    data: any;
    error: any;
    contentType: string;
  }> {
    try {
      // Pobierz wynik testu
      const { data: testResult, error: testError } =
        await this.getTestResultById(supabase, id);

      if (testError) {
        return {
          data: null,
          error: testError,
          contentType: "application/json",
        };
      }

      if (!testResult) {
        return {
          data: null,
          error: new Error("Test result not found"),
          contentType: "application/json",
        };
      }

      let resourceData = [];

      // Pobierz dane zasobów, jeśli wymagane
      if (includeResources) {
        const { data: resources, error: resourcesError } = await supabase
          .from("resource_metrics")
          .select("*")
          .eq("result_id", id);

        if (resourcesError) {
          return {
            data: null,
            error: resourcesError,
            contentType: "application/json",
          };
        }

        resourceData = resources || [];
      }

      // Przygotuj dane do eksportu
      const exportData = {
        test_result: testResult,
        resources: includeResources ? resourceData : undefined,
      };

      // Formatuj dane zgodnie z żądanym formatem
      if (format === "json") {
        return {
          data: JSON.stringify(exportData, null, 2),
          error: null,
          contentType: "application/json",
        };
      } else if (format === "csv") {
        // Implementacja eksportu CSV
        const csv = this.convertToCSV(exportData);
        return {
          data: csv,
          error: null,
          contentType: "text/csv",
        };
      } else {
        return {
          data: null,
          error: new Error("Unsupported export format"),
          contentType: "application/json",
        };
      }
    } catch (error) {
      console.error("Error exporting test result:", error);
      return { data: null, error, contentType: "application/json" };
    }
  }

  /**
   * Konwertuje dane obiektu na format CSV
   * Metoda pomocnicza dla eksportu CSV
   *
   * @param data - Dane do konwersji
   * @returns Ciąg znaków CSV
   */
  private static convertToCSV(data: any): string {
    // Prosta implementacja konwersji JSON na CSV
    const testResult = data.test_result;
    let csv = "property,value\n";

    // Dodaj właściwości wyniku testu
    Object.entries(testResult).forEach(([key, value]) => {
      if (key === "raw_metrics") {
        // Obsługa złożonych danych JSON
        if (value) {
          csv += `${key},${JSON.stringify(value).replace(/,/g, ";")}\n`;
        } else {
          csv += `${key},null\n`;
        }
      } else {
        csv += `${key},${value}\n`;
      }
    });

    // Dodaj dane zasobów, jeśli istnieją
    if (data.resources && data.resources.length > 0) {
      csv +=
        "\nresource_id,resource_url,resource_type,size,load_time,cache_hit\n";

      data.resources.forEach((resource) => {
        csv += `${resource.id},${resource.resource_url},${resource.resource_type},${resource.size || 0},${resource.load_time || 0},${resource.cache_hit || false}\n`;
      });
    }

    return csv;
  }
}
