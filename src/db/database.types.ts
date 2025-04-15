export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      environment_info: {
        Row: {
          additional_info: Json | null
          browser: string
          browser_version: string
          device_type: string | null
          id: string
          os: string
          os_version: string
          session_id: string
        }
        Insert: {
          additional_info?: Json | null
          browser: string
          browser_version: string
          device_type?: string | null
          id?: string
          os: string
          os_version: string
          session_id: string
        }
        Update: {
          additional_info?: Json | null
          browser?: string
          browser_version?: string
          device_type?: string | null
          id?: string
          os?: string
          os_version?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "environment_info_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      network_conditions: {
        Row: {
          additional_config: Json | null
          bandwidth: number | null
          condition_type: string
          id: string
          latency: number | null
          packet_loss: number | null
          session_id: string
        }
        Insert: {
          additional_config?: Json | null
          bandwidth?: number | null
          condition_type: string
          id?: string
          latency?: number | null
          packet_loss?: number | null
          session_id: string
        }
        Update: {
          additional_config?: Json | null
          bandwidth?: number | null
          condition_type?: string
          id?: string
          latency?: number | null
          packet_loss?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_conditions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_metrics: {
        Row: {
          additional_metrics: Json | null
          cache_hit: boolean | null
          id: string
          load_time: number | null
          mime_type: string | null
          resource_type: string
          resource_url: string
          result_id: string | null
          session_id: string
          size: number | null
          strategy_used: string | null
        }
        Insert: {
          additional_metrics?: Json | null
          cache_hit?: boolean | null
          id?: string
          load_time?: number | null
          mime_type?: string | null
          resource_type: string
          resource_url: string
          result_id?: string | null
          session_id: string
          size?: number | null
          strategy_used?: string | null
        }
        Update: {
          additional_metrics?: Json | null
          cache_hit?: boolean | null
          id?: string
          load_time?: number | null
          mime_type?: string | null
          resource_type?: string
          resource_url?: string
          result_id?: string | null
          session_id?: string
          size?: number | null
          strategy_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_metrics_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_metrics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string
          id: string
          name: string
        }
        Insert: {
          category: string
          id?: string
          name: string
        }
        Update: {
          category?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          fcp: number | null
          fid: number | null
          fp: number | null
          id: string
          lcp: number | null
          offline_availability: boolean | null
          raw_metrics: Json | null
          session_id: string
          strategy_type: string
          timestamp_end: string | null
          timestamp_start: string
          ttfb: number | null
          tti: number | null
        }
        Insert: {
          fcp?: number | null
          fid?: number | null
          fp?: number | null
          id?: string
          lcp?: number | null
          offline_availability?: boolean | null
          raw_metrics?: Json | null
          session_id: string
          strategy_type: string
          timestamp_end?: string | null
          timestamp_start?: string
          ttfb?: number | null
          tti?: number | null
        }
        Update: {
          fcp?: number | null
          fid?: number | null
          fp?: number | null
          id?: string
          lcp?: number | null
          offline_availability?: boolean | null
          raw_metrics?: Json | null
          session_id?: string
          strategy_type?: string
          timestamp_end?: string | null
          timestamp_start?: string
          ttfb?: number | null
          tti?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_sessions: {
        Row: {
          created_at: string
          description: string | null
          duration: unknown | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: unknown | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: unknown | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test_tags: {
        Row: {
          tag_id: string
          test_id: string
        }
        Insert: {
          tag_id: string
          test_id: string
        }
        Update: {
          tag_id?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_tags_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string
          auth_provider: string
          created_at: string
          email: string
          id: string
          last_login: string | null
        }
        Insert: {
          auth_id: string
          auth_provider: string
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
        }
        Update: {
          auth_id?: string
          auth_provider?: string
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

