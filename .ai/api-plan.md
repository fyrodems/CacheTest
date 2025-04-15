# REST API Plan

## 1. Resources

- **Users**: Represents application users (`users` table)
- **Test Sessions**: Testing sessions for caching strategies (`test_sessions` table)
- **Test Results**: Performance metrics for each caching strategy test (`test_results` table)
- **Environment Info**: Browser and system information (`environment_info` table)
- **Network Conditions**: Simulated network conditions (`network_conditions` table)
- **Resource Metrics**: Metrics for resources loaded during tests (`resource_metrics` table)
- **Tags**: Categorization tags for tests (`tags` table)
- **Cache Management**: Utilities for managing the browser cache

## 2. Endpoints

### Authentication

Authentication will be handled by Supabase Auth with OAuth providers.

### Test Sessions

#### GET /api/test-sessions

- **Description**: Retrieve all test sessions for the authenticated user
- **Query Parameters**:
  - `page` (integer): Page number for pagination
  - `limit` (integer): Number of items per page
  - `sort` (string): Sort field (e.g., created_at, name)
  - `order` (string): Sort order (asc, desc)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string",
        "created_at": "timestamp",
        "duration": "interval",
        "user_id": "uuid"
      }
    ],
    "pagination": {
      "total": "integer",
      "page": "integer",
      "limit": "integer",
      "pages": "integer"
    }
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized

#### POST /api/test-sessions

- **Description**: Create a new test session
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "created_at": "timestamp",
    "user_id": "uuid"
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized

#### GET /api/test-sessions/{id}

- **Description**: Retrieve a specific test session
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "created_at": "timestamp",
    "duration": "interval",
    "user_id": "uuid"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### PUT /api/test-sessions/{id}

- **Description**: Update a test session
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "created_at": "timestamp",
    "duration": "interval",
    "user_id": "uuid"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### DELETE /api/test-sessions/{id}

- **Description**: Delete a test session
- **Status Codes**:
  - 204: No Content
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

### Test Results

#### GET /api/test-results

- **Description**: Retrieve test results for the authenticated user
- **Query Parameters**:
  - `session_id` (uuid): Filter by session ID
  - `strategy_type` (string): Filter by caching strategy
  - `metric` (string): Filter by metric (fp, fcp, tti, lcp, fid, ttfb)
  - `min_value` (number): Minimum value for the metric
  - `max_value` (number): Maximum value for the metric
  - `page` (integer): Page number for pagination
  - `limit` (integer): Number of items per page
  - `sort` (string): Sort field
  - `order` (string): Sort order (asc, desc)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "session_id": "uuid",
        "strategy_type": "string",
        "fp": "number",
        "fcp": "number",
        "tti": "number",
        "lcp": "number",
        "fid": "number",
        "ttfb": "number",
        "offline_availability": "boolean",
        "timestamp_start": "timestamp",
        "timestamp_end": "timestamp"
      }
    ],
    "pagination": {
      "total": "integer",
      "page": "integer",
      "limit": "integer",
      "pages": "integer"
    }
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized

#### POST /api/test-results

- **Description**: Create a new test result
- **Request Body**:
  ```json
  {
    "session_id": "uuid",
    "strategy_type": "string",
    "fp": "number",
    "fcp": "number",
    "tti": "number",
    "lcp": "number",
    "fid": "number",
    "ttfb": "number",
    "offline_availability": "boolean",
    "raw_metrics": "object"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "strategy_type": "string",
    "fp": "number",
    "fcp": "number",
    "tti": "number",
    "lcp": "number",
    "fid": "number",
    "ttfb": "number",
    "offline_availability": "boolean",
    "timestamp_start": "timestamp",
    "timestamp_end": "timestamp"
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized

#### GET /api/test-results/{id}

- **Description**: Retrieve a specific test result
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "strategy_type": "string",
    "fp": "number",
    "fcp": "number",
    "tti": "number",
    "lcp": "number",
    "fid": "number",
    "ttfb": "number",
    "offline_availability": "boolean",
    "timestamp_start": "timestamp",
    "timestamp_end": "timestamp",
    "raw_metrics": "object"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### DELETE /api/test-results/{id}

- **Description**: Delete a test result
- **Status Codes**:
  - 204: No Content
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### GET /api/test-results/{id}/export

- **Description**: Export test result in specified format
- **Query Parameters**:
  - `format` (string): Export format (csv, json)
  - `include_resources` (boolean): Include resource metrics
- **Response**: File download in requested format
- **Status Codes**:
  - 200: Success
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### GET /api/test-results/compare

- **Description**: Compare multiple test results
- **Query Parameters**:
  - `ids` (string): Comma-separated list of test result IDs
- **Response**:
  ```json
  {
    "results": [
      {
        "id": "uuid",
        "strategy_type": "string",
        "metrics": {
          "fp": "number",
          "fcp": "number",
          "tti": "number",
          "lcp": "number",
          "fid": "number",
          "ttfb": "number"
        }
      }
    ],
    "comparison": {
      "best_overall": "uuid",
      "metrics_comparison": {
        "fp": { "best": "uuid", "diff_percentage": "object" },
        "fcp": { "best": "uuid", "diff_percentage": "object" },
        "tti": { "best": "uuid", "diff_percentage": "object" },
        "lcp": { "best": "uuid", "diff_percentage": "object" },
        "fid": { "best": "uuid", "diff_percentage": "object" },
        "ttfb": { "best": "uuid", "diff_percentage": "object" }
      }
    }
  }
  ```
- **Status Codes**:
  - 200: Success
  - 400: Bad Request
  - 401: Unauthorized

### Environment Info

#### GET /api/test-sessions/{session_id}/environment

- **Description**: Retrieve environment information for a test session
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "browser": "string",
    "browser_version": "string",
    "os": "string",
    "os_version": "string",
    "device_type": "string",
    "additional_info": "object"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### POST /api/test-sessions/{session_id}/environment

- **Description**: Create environment information for a test session
- **Request Body**:
  ```json
  {
    "browser": "string",
    "browser_version": "string",
    "os": "string",
    "os_version": "string",
    "device_type": "string",
    "additional_info": "object"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "browser": "string",
    "browser_version": "string",
    "os": "string",
    "os_version": "string",
    "device_type": "string",
    "additional_info": "object"
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 409: Conflict (if environment info already exists)

### Network Conditions

#### GET /api/test-sessions/{session_id}/network-conditions

- **Description**: Retrieve network conditions for a test session
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "condition_type": "string",
    "latency": "integer",
    "bandwidth": "integer",
    "packet_loss": "number",
    "additional_config": "object"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### POST /api/test-sessions/{session_id}/network-conditions

- **Description**: Set network conditions for a test session
- **Request Body**:
  ```json
  {
    "condition_type": "string",
    "latency": "integer",
    "bandwidth": "integer",
    "packet_loss": "number",
    "additional_config": "object"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "condition_type": "string",
    "latency": "integer",
    "bandwidth": "integer",
    "packet_loss": "number",
    "additional_config": "object"
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 409: Conflict (if network conditions already exist)

### Resource Metrics

#### GET /api/test-results/{result_id}/resources

- **Description**: Retrieve resource metrics for a test result
- **Query Parameters**:
  - `resource_type` (string): Filter by resource type
  - `page` (integer): Page number for pagination
  - `limit` (integer): Number of items per page
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "session_id": "uuid",
        "result_id": "uuid",
        "resource_url": "string",
        "resource_type": "string",
        "size": "integer",
        "mime_type": "string",
        "load_time": "number",
        "cache_hit": "boolean",
        "strategy_used": "string"
      }
    ],
    "pagination": {
      "total": "integer",
      "page": "integer",
      "limit": "integer",
      "pages": "integer"
    }
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### POST /api/test-results/{result_id}/resources

- **Description**: Add resource metrics for a test result
- **Request Body**:
  ```json
  {
    "resource_url": "string",
    "resource_type": "string",
    "size": "integer",
    "mime_type": "string",
    "load_time": "number",
    "cache_hit": "boolean",
    "strategy_used": "string",
    "additional_metrics": "object"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "session_id": "uuid",
    "result_id": "uuid",
    "resource_url": "string",
    "resource_type": "string",
    "size": "integer",
    "mime_type": "string",
    "load_time": "number",
    "cache_hit": "boolean",
    "strategy_used": "string"
  }
  ```
- **Status Codes**:
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

### Tags

#### GET /api/tags

- **Description**: Retrieve all available tags
- **Query Parameters**:
  - `category` (string): Filter by category (strategy, resource, network)
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "category": "string"
      }
    ]
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized

#### POST /api/test-results/{id}/tags

- **Description**: Add tags to a test result
- **Request Body**:
  ```json
  {
    "tag_ids": ["uuid"]
  }
  ```
- **Response**:
  ```json
  {
    "test_id": "uuid",
    "tags": [
      {
        "id": "uuid",
        "name": "string",
        "category": "string"
      }
    ]
  }
  ```
- **Status Codes**:
  - 200: Success
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### GET /api/test-results/{id}/tags

- **Description**: Retrieve tags for a test result
- **Response**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "name": "string",
        "category": "string"
      }
    ]
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

#### DELETE /api/test-results/{result_id}/tags/{tag_id}

- **Description**: Remove a tag from a test result
- **Status Codes**:
  - 204: No Content
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found

### Cache Management

#### POST /api/cache/reset

- **Description**: Reset the browser cache
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string",
    "instructions": "object"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 401: Unauthorized

## 3. Authentication and Authorization

Authentication will be handled through Supabase Auth with OAuth providers. This provides:

- Secure authentication via OAuth (Google, GitHub, etc.)
- JWT tokens for API authorization
- Integration with PostgreSQL RLS policies

Authorization is implemented at two levels:
1. **API level**: JWT verification middleware ensures only authenticated users can access protected endpoints
2. **Database level**: Row Level Security (RLS) policies restrict users to accessing only their own data

JWT tokens should be included in the Authorization header of all requests to protected endpoints:
```
Authorization: Bearer [JWT token]
```

## 4. Validation and Business Logic

### Validation Rules

#### Test Sessions
- `name`: Required, string
- `description`: Optional, string

#### Test Results
- `session_id`: Required, valid UUID of existing session owned by user
- `strategy_type`: Required, one of: "network-first", "cache-first", "stale-while-revalidate", "cache-then-network"
- Metrics: Optional but should be numbers if provided

#### Environment Info
- `browser`, `browser_version`, `os`, `os_version`: Required, strings
- One environment info per session

#### Network Conditions
- `condition_type`: Required, one of: "good", "slow", "flaky", "offline"
- `latency`, `bandwidth`: Optional, integers
- `packet_loss`: Optional, number between 0 and 100
- One network condition per session

#### Resource Metrics
- `resource_url`: Required, string
- `resource_type`: Required, string

#### Tags
- Valid tag IDs must be provided when adding tags to a test result

### Business Logic Implementation

1. **Test Session Management**:
   - Users can only access their own test sessions
   - Deleting a test session cascades to all related data

2. **Performance Metrics**:
   - Metrics are collected client-side and sent to the API
   - API stores both raw and processed metrics

3. **Caching Strategies**:
   - Client implements the four caching strategies
   - API stores results and allows comparison

4. **Network Condition Simulation**:
   - Client simulates network conditions based on parameters
   - API provides configuration instructions

5. **Resource Tracking**:
   - Client tracks resource loading metrics
   - API stores and aggregates resource metrics

6. **Tag Management**:
   - Predefined tags for strategies, resources, and network conditions
   - Users can apply tags to test results for categorization

7. **Export Functionality**:
   - API formats test results for export in requested format
   - Includes all relevant metrics and metadata

8. **Cache Management**:
   - API provides instructions for client-side cache management
   - Client executes cache operations via Service Worker API 