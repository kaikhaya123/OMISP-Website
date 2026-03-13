export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      founder_profiles: {
        Row: {
          company_name: string | null
          created_at: string
          founder_id: string
          growth_percent: number
          industry: string | null
          location: string | null
          logo_url: string | null
          mrr_usd: number
          raised_usd: number
          stage: string | null
          tagline: string | null
          team_size: number
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          founder_id: string
          growth_percent?: number
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          mrr_usd?: number
          raised_usd?: number
          stage?: string | null
          tagline?: string | null
          team_size?: number
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          founder_id?: string
          growth_percent?: number
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          mrr_usd?: number
          raised_usd?: number
          stage?: string | null
          tagline?: string | null
          team_size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "founder_profiles_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_views: {
        Row: {
          created_at: string
          founder_id: string
          id: string
          investor_id: string
        }
        Insert: {
          created_at?: string
          founder_id: string
          id?: string
          investor_id: string
        }
        Update: {
          created_at?: string
          founder_id?: string
          id?: string
          investor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_views_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_views_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          founder_id: string
          id: string
          proof_url: string | null
          type: string
          value: string | null
        }
        Insert: {
          created_at?: string
          founder_id: string
          id?: string
          proof_url?: string | null
          type: string
          value?: string | null
        }
        Update: {
          created_at?: string
          founder_id?: string
          id?: string
          proof_url?: string | null
          type?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      omisp_scores: {
        Row: {
          aptitude_score: number
          execution_score: number
          founder_id: string
          idea_score: number
          resilience_score: number
          total_score: number
          unicorn_score: number
          updated_at: string
          velocity_score: number
        }
        Insert: {
          aptitude_score?: number
          execution_score?: number
          founder_id: string
          idea_score?: number
          resilience_score?: number
          total_score?: number
          unicorn_score?: number
          updated_at?: string
          velocity_score?: number
        }
        Update: {
          aptitude_score?: number
          execution_score?: number
          founder_id?: string
          idea_score?: number
          resilience_score?: number
          total_score?: number
          unicorn_score?: number
          updated_at?: string
          velocity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "omisp_scores_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          industry: string | null
          role: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          industry?: string | null
          role: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          industry?: string | null
          role?: string
        }
        Relationships: []
      }
      vc_alert_preferences: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          industries: string[] | null
          min_score: number
          stages: string[] | null
          vc_user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          industries?: string[] | null
          min_score?: number
          stages?: string[] | null
          vc_user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          industries?: string[] | null
          min_score?: number
          stages?: string[] | null
          vc_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vc_alert_preferences_vc_user_id_fkey"
            columns: ["vc_user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vc_intro_requests: {
        Row: {
          created_at: string
          founder_id: string
          id: string
          message: string | null
          status: string
          updated_at: string
          vc_user_id: string
        }
        Insert: {
          created_at?: string
          founder_id: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
          vc_user_id: string
        }
        Update: {
          created_at?: string
          founder_id?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
          vc_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vc_intro_requests_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vc_intro_requests_vc_user_id_fkey"
            columns: ["vc_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vc_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          firm_name: string | null
          fund_size: string | null
          id: string
          industries: string[] | null
          investment_stage_focus: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          firm_name?: string | null
          fund_size?: string | null
          id: string
          industries?: string[] | null
          investment_stage_focus?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          firm_name?: string | null
          fund_size?: string | null
          id?: string
          industries?: string[] | null
          investment_stage_focus?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vc_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vc_watchlist: {
        Row: {
          created_at: string
          founder_id: string
          id: string
          notes: string | null
          pipeline_stage: string
          updated_at: string
          vc_user_id: string
        }
        Insert: {
          created_at?: string
          founder_id: string
          id?: string
          notes?: string | null
          pipeline_stage?: string
          updated_at?: string
          vc_user_id: string
        }
        Update: {
          created_at?: string
          founder_id?: string
          id?: string
          notes?: string | null
          pipeline_stage?: string
          updated_at?: string
          vc_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vc_watchlist_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vc_watchlist_vc_user_id_fkey"
            columns: ["vc_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_stats: {
        Args: never
        Returns: {
          avg_omisp_score: number
          total_founders: number
          total_investors: number
          total_milestones: number
          total_profile_views: number
          unicorn_candidates: number
          vc_eligible_founders: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
