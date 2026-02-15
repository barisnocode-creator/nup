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
      agenda_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          note_date: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          note_date: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          note_date?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          page_path: string | null
          project_id: string
          user_agent: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          page_path?: string | null
          project_id: string
          user_agent?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          page_path?: string | null
          project_id?: string
          user_agent?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_settings: {
        Row: {
          buffer_minutes: number
          consent_required: boolean
          consent_text: string | null
          created_at: string
          day_schedules: Json | null
          form_fields: Json | null
          id: string
          is_enabled: boolean
          lunch_break_end: string | null
          lunch_break_start: string | null
          max_advance_days: number
          notification_email_enabled: boolean
          project_id: string
          reminder_24h_enabled: boolean
          reminder_2h_enabled: boolean
          slot_duration_minutes: number
          timezone: string
          updated_at: string
          user_id: string
          working_days: Json
          working_hours_end: string
          working_hours_start: string
        }
        Insert: {
          buffer_minutes?: number
          consent_required?: boolean
          consent_text?: string | null
          created_at?: string
          day_schedules?: Json | null
          form_fields?: Json | null
          id?: string
          is_enabled?: boolean
          lunch_break_end?: string | null
          lunch_break_start?: string | null
          max_advance_days?: number
          notification_email_enabled?: boolean
          project_id: string
          reminder_24h_enabled?: boolean
          reminder_2h_enabled?: boolean
          slot_duration_minutes?: number
          timezone?: string
          updated_at?: string
          user_id: string
          working_days?: Json
          working_hours_end?: string
          working_hours_start?: string
        }
        Update: {
          buffer_minutes?: number
          consent_required?: boolean
          consent_text?: string | null
          created_at?: string
          day_schedules?: Json | null
          form_fields?: Json | null
          id?: string
          is_enabled?: boolean
          lunch_break_end?: string | null
          lunch_break_start?: string | null
          max_advance_days?: number
          notification_email_enabled?: boolean
          project_id?: string
          reminder_24h_enabled?: boolean
          reminder_2h_enabled?: boolean
          slot_duration_minutes?: number
          timezone?: string
          updated_at?: string
          user_id?: string
          working_days?: Json
          working_hours_end?: string
          working_hours_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_settings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_settings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          client_email: string
          client_name: string
          client_note: string | null
          client_phone: string | null
          consent_given: boolean | null
          created_at: string
          end_time: string
          form_data: Json | null
          id: string
          internal_note: string | null
          project_id: string
          start_time: string
          status: string
          timezone: string
        }
        Insert: {
          appointment_date: string
          client_email: string
          client_name: string
          client_note?: string | null
          client_phone?: string | null
          consent_given?: boolean | null
          created_at?: string
          end_time: string
          form_data?: Json | null
          id?: string
          internal_note?: string | null
          project_id: string
          start_time: string
          status?: string
          timezone?: string
        }
        Update: {
          appointment_date?: string
          client_email?: string
          client_name?: string
          client_note?: string | null
          client_phone?: string | null
          consent_given?: boolean | null
          created_at?: string
          end_time?: string
          form_data?: Json | null
          id?: string
          internal_note?: string | null
          project_id?: string
          start_time?: string
          status?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_slots: {
        Row: {
          block_end_time: string | null
          block_start_time: string | null
          block_type: string
          blocked_date: string
          created_at: string
          id: string
          project_id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          block_end_time?: string | null
          block_start_time?: string | null
          block_type?: string
          blocked_date: string
          created_at?: string
          id?: string
          project_id: string
          reason?: string | null
          user_id: string
        }
        Update: {
          block_end_time?: string | null
          block_start_time?: string | null
          block_type?: string
          blocked_date?: string
          created_at?: string
          id?: string
          project_id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_slots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_slots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          project_id: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          project_id: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          project_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      custom_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          is_primary: boolean
          project_id: string
          status: string
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          is_primary?: boolean
          project_id: string
          status?: string
          verification_token?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          is_primary?: boolean
          project_id?: string
          status?: string
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_domains_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_domains_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          appointment_id: string | null
          channel: string
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          notification_id: string | null
          project_id: string
          recipient_email: string | null
          recipient_type: string
          status: string
        }
        Insert: {
          appointment_id?: string | null
          channel: string
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          notification_id?: string | null
          project_id: string
          recipient_email?: string | null
          recipient_type?: string
          status?: string
        }
        Update: {
          appointment_id?: string | null
          channel?: string
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          notification_id?: string | null
          project_id?: string
          recipient_email?: string | null
          recipient_type?: string
          status?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          body_template: string
          channel: string
          created_at: string
          event_type: string
          id: string
          is_enabled: boolean
          project_id: string
          subject: string
          target: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body_template: string
          channel?: string
          created_at?: string
          event_type: string
          id?: string
          is_enabled?: boolean
          project_id: string
          subject: string
          target?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body_template?: string
          channel?: string
          created_at?: string
          event_type?: string
          id?: string
          is_enabled?: boolean
          project_id?: string
          subject?: string
          target?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          appointment_id: string | null
          body: string
          channel: string
          created_at: string
          id: string
          is_read: boolean
          project_id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          body: string
          channel?: string
          created_at?: string
          id?: string
          is_read?: boolean
          project_id: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          body?: string
          channel?: string
          created_at?: string
          id?: string
          is_read?: boolean
          project_id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          chai_blocks: Json | null
          chai_theme: Json | null
          created_at: string
          custom_domain: string | null
          form_data: Json | null
          generated_content: Json | null
          grapes_content: Json | null
          id: string
          is_published: boolean | null
          name: string
          netlify_custom_domain: string | null
          netlify_site_id: string | null
          netlify_url: string | null
          profession: string
          published_at: string | null
          status: string
          subdomain: string | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          chai_blocks?: Json | null
          chai_theme?: Json | null
          created_at?: string
          custom_domain?: string | null
          form_data?: Json | null
          generated_content?: Json | null
          grapes_content?: Json | null
          id?: string
          is_published?: boolean | null
          name?: string
          netlify_custom_domain?: string | null
          netlify_site_id?: string | null
          netlify_url?: string | null
          profession: string
          published_at?: string | null
          status?: string
          subdomain?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          chai_blocks?: Json | null
          chai_theme?: Json | null
          created_at?: string
          custom_domain?: string | null
          form_data?: Json | null
          generated_content?: Json | null
          grapes_content?: Json | null
          id?: string
          is_published?: boolean | null
          name?: string
          netlify_custom_domain?: string | null
          netlify_site_id?: string | null
          netlify_url?: string | null
          profession?: string
          published_at?: string | null
          status?: string
          subdomain?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      studio_images: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          metadata: Json | null
          project_id: string | null
          prompt: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          metadata?: Json | null
          project_id?: string | null
          prompt: string
          status?: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          metadata?: Json | null
          project_id?: string | null
          prompt?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "studio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studio_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      custom_domains_safe: {
        Row: {
          created_at: string | null
          domain: string | null
          id: string | null
          is_primary: boolean | null
          project_id: string | null
          status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_primary?: boolean | null
          project_id?: string | null
          status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          id?: string | null
          is_primary?: boolean | null
          project_id?: string | null
          status?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_domains_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_domains_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "public_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      public_projects: {
        Row: {
          chai_blocks: Json | null
          chai_theme: Json | null
          custom_domain: string | null
          generated_content: Json | null
          id: string | null
          is_published: boolean | null
          name: string | null
          profession: string | null
          published_at: string | null
          subdomain: string | null
          template_id: string | null
        }
        Insert: {
          chai_blocks?: Json | null
          chai_theme?: Json | null
          custom_domain?: string | null
          generated_content?: Json | null
          id?: string | null
          is_published?: boolean | null
          name?: string | null
          profession?: string | null
          published_at?: string | null
          subdomain?: string | null
          template_id?: string | null
        }
        Update: {
          chai_blocks?: Json | null
          chai_theme?: Json | null
          custom_domain?: string | null
          generated_content?: Json | null
          id?: string | null
          is_published?: boolean | null
          name?: string | null
          profession?: string | null
          published_at?: string | null
          subdomain?: string | null
          template_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_domain_dns_instructions: {
        Args: { domain_id: string }
        Returns: Json
      }
      hash_visitor_id: { Args: { raw_visitor_id: string }; Returns: string }
      user_owns_project: { Args: { project_id: string }; Returns: boolean }
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
