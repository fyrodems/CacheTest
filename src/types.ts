/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { type Json, type Tables, type TablesInsert } from "./db/database.types";

/**
 * Common types
 */

/**
 * Pagination response for list endpoints
 */
export type PaginationResponseDTO = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

/**
 * Generic list response with pagination
 */
export type ListResponseDTO<T> = {
  data: T[];
  pagination: PaginationResponseDTO;
};

/**
 * Test Sessions
 */

/**
 * Response DTO for a single test session
 */
export type TestSessionResponseDTO = Tables<"test_sessions">;

/**
 * Response DTO for a list of test sessions
 */
export type TestSessionListResponseDTO =
  ListResponseDTO<TestSessionResponseDTO>;

/**
 * Command model for creating a new test session
 */
export type CreateTestSessionDTO = Pick<
  TablesInsert<"test_sessions">,
  "name" | "description"
>;

/**
 * Command model for updating an existing test session
 */
export type UpdateTestSessionDTO = CreateTestSessionDTO;

/**
 * Test Results
 */

/**
 * Performance metrics for test results
 */
export type TestResultMetricsDTO = {
  fp?: number | null;
  fcp?: number | null;
  tti?: number | null;
  lcp?: number | null;
  fid?: number | null;
  ttfb?: number | null;
  offline_availability?: boolean | null;
};

/**
 * Response DTO for a single test result
 */
export type TestResultResponseDTO = Tables<"test_results">;

/**
 * Response DTO for a list of test results
 */
export type TestResultListResponseDTO = ListResponseDTO<TestResultResponseDTO>;

/**
 * Command model for creating a new test result
 */
export type CreateTestResultDTO = Pick<
  TablesInsert<"test_results">,
  "session_id" | "strategy_type"
> &
  TestResultMetricsDTO & {
    raw_metrics?: Json | null;
  };

/**
 * Metrics comparison data structure
 */
export type MetricComparisonDTO = {
  best: string; // ID of the best performing test result
  diff_percentage: Record<string, number>; // Difference percentage for each test result ID
};

/**
 * Response DTO for test results comparison
 */
export type TestResultComparisonResponseDTO = {
  results: {
    id: string;
    strategy_type: string;
    metrics: TestResultMetricsDTO;
  }[];
  comparison: {
    best_overall: string; // ID of the best overall performing test result
    metrics_comparison: {
      fp?: MetricComparisonDTO;
      fcp?: MetricComparisonDTO;
      tti?: MetricComparisonDTO;
      lcp?: MetricComparisonDTO;
      fid?: MetricComparisonDTO;
      ttfb?: MetricComparisonDTO;
    };
  };
};

/**
 * Environment Info
 */

/**
 * Response DTO for environment information
 */
export type EnvironmentInfoResponseDTO = Tables<"environment_info">;

/**
 * Command model for creating environment information
 */
export type CreateEnvironmentInfoDTO = Omit<
  TablesInsert<"environment_info">,
  "id" | "session_id"
>;

/**
 * Network Conditions
 */

/**
 * Response DTO for network conditions
 */
export type NetworkConditionsResponseDTO = Tables<"network_conditions">;

/**
 * Command model for creating network conditions
 */
export type CreateNetworkConditionsDTO = Omit<
  TablesInsert<"network_conditions">,
  "id" | "session_id"
>;

/**
 * Resource Metrics
 */

/**
 * Response DTO for a single resource metric
 */
export type ResourceMetricResponseDTO = Tables<"resource_metrics">;

/**
 * Response DTO for a list of resource metrics
 */
export type ResourceMetricListResponseDTO =
  ListResponseDTO<ResourceMetricResponseDTO>;

/**
 * Command model for creating a resource metric
 */
export type CreateResourceMetricDTO = Omit<
  TablesInsert<"resource_metrics">,
  "id" | "session_id" | "result_id"
> & {
  additional_metrics?: Json | null;
};

/**
 * Tags
 */

/**
 * Response DTO for a single tag
 */
export type TagResponseDTO = Tables<"tags">;

/**
 * Response DTO for a list of tags
 */
export type TagListResponseDTO = {
  data: TagResponseDTO[];
};

/**
 * Command model for adding tags to a test result
 */
export type AddTagsToTestResultDTO = {
  tag_ids: string[];
};

/**
 * Response DTO for tags assigned to a test result
 */
export type TestResultTagsResponseDTO = {
  test_id: string;
  tags: TagResponseDTO[];
};

/**
 * Cache Management
 */

/**
 * Response DTO for cache reset operation
 */
export type CacheResetResponseDTO = {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instructions?: Record<string, any>;
};

/**
 * Export options
 */
export type ExportFormat = "csv" | "json";

/**
 * Export options query parameters
 */
export type ExportOptionsDTO = {
  format: ExportFormat;
  include_resources: boolean;
};
