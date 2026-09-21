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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          ngo_id: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          ngo_id?: string | null
          severity?: string
          status?: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          ngo_id?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_results: {
        Row: {
          confidence: number
          created_at: string
          difference: number
          expected_count: number
          id: string
          image_url: string | null
          inspection_id: string
          ngo_id: string
          officer_id: string
          people_count: number
          status: string
        }
        Insert: {
          confidence: number
          created_at?: string
          difference: number
          expected_count: number
          id?: string
          image_url?: string | null
          inspection_id: string
          ngo_id: string
          officer_id: string
          people_count: number
          status: string
        }
        Update: {
          confidence?: number
          created_at?: string
          difference?: number
          expected_count?: number
          id?: string
          image_url?: string | null
          inspection_id?: string
          ngo_id?: string
          officer_id?: string
          people_count?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_results_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_results_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor: string
          created_at: string
          id: string
          target: string
        }
        Insert: {
          action: string
          actor: string
          created_at?: string
          id?: string
          target?: string
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          id?: string
          target?: string
        }
        Relationships: []
      }
      beneficiary_feedback: {
        Row: {
          cleanliness_rating: number
          comments: string | null
          created_at: string
          facilities_rating: number
          id: string
          ngo_id: string
          overall_rating: number
          promised_services: boolean
          safety_rating: number
          staff_behaviour_rating: number
          submission_key: string
        }
        Insert: {
          cleanliness_rating: number
          comments?: string | null
          created_at?: string
          facilities_rating: number
          id?: string
          ngo_id: string
          overall_rating: number
          promised_services: boolean
          safety_rating: number
          staff_behaviour_rating: number
          submission_key: string
        }
        Update: {
          cleanliness_rating?: number
          comments?: string | null
          created_at?: string
          facilities_rating?: number
          id?: string
          ngo_id?: string
          overall_rating?: number
          promised_services?: boolean
          safety_rating?: number
          staff_behaviour_rating?: number
          submission_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiary_feedback_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          created_at: string
          id: string
          image_url: string
          inspection_id: string
          latitude: number | null
          longitude: number | null
          ngo_id: string
          officer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          inspection_id: string
          latitude?: number | null
          longitude?: number | null
          ngo_id: string
          officer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          inspection_id?: string
          latitude?: number | null
          longitude?: number | null
          ngo_id?: string
          officer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          attendance_confidence: number | null
          attendance_count: number | null
          attendance_difference: number | null
          checklist: Json
          created_at: string
          distance_meters: number | null
          expected_attendance: number | null
          id: string
          inspection_type: string
          latitude: number | null
          location_verified: boolean
          longitude: number | null
          ngo_id: string
          officer_id: string
          remarks: string | null
          status: string
        }
        Insert: {
          attendance_confidence?: number | null
          attendance_count?: number | null
          attendance_difference?: number | null
          checklist?: Json
          created_at?: string
          distance_meters?: number | null
          expected_attendance?: number | null
          id?: string
          inspection_type?: string
          latitude?: number | null
          location_verified?: boolean
          longitude?: number | null
          ngo_id: string
          officer_id: string
          remarks?: string | null
          status?: string
        }
        Update: {
          attendance_confidence?: number | null
          attendance_count?: number | null
          attendance_difference?: number | null
          checklist?: Json
          created_at?: string
          distance_meters?: number | null
          expected_attendance?: number | null
          id?: string
          inspection_type?: string
          latitude?: number | null
          location_verified?: boolean
          longitude?: number | null
          ngo_id?: string
          officer_id?: string
          remarks?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      ngos: {
        Row: {
          cctv_status: string
          city: string
          compliance: number
          created_at: string
          district: string
          expected_attendance: number
          id: string
          is_demo: boolean
          last_inspection: string | null
          latitude: number
          longitude: number
          name: string
          risk_level: string
          state: string
        }
        Insert: {
          cctv_status?: string
          city: string
          compliance?: number
          created_at?: string
          district: string
          expected_attendance?: number
          id?: string
          is_demo?: boolean
          last_inspection?: string | null
          latitude: number
          longitude: number
          name: string
          risk_level?: string
          state: string
        }
        Update: {
          cctv_status?: string
          city?: string
          compliance?: number
          created_at?: string
          district?: string
          expected_attendance?: number
          id?: string
          is_demo?: boolean
          last_inspection?: string | null
          latitude?: number
          longitude?: number
          name?: string
          risk_level?: string
          state?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string
          email: string
          id: string
          name: string
          photo_url: string | null
        }
        Insert: {
          created_at?: string
          district?: string
          email?: string
          id: string
          name?: string
          photo_url?: string | null
        }
        Update: {
          created_at?: string
          district?: string
          email?: string
          id?: string
          name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          ai_summary: string | null
          id: string
          inspection_id: string
          ngo_id: string
          officer_id: string
          officer_name: string
          overall_compliance: number
          review_note: string | null
          reviewed_at: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          ai_summary?: string | null
          id?: string
          inspection_id: string
          ngo_id: string
          officer_id: string
          officer_name?: string
          overall_compliance?: number
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          ai_summary?: string | null
          id?: string
          inspection_id?: string
          ngo_id?: string
          officer_id?: string
          officer_name?: string
          overall_compliance?: number
          review_note?: string | null
          reviewed_at?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "inspection_officer"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "inspection_officer"],
    },
  },
} as const
