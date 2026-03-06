export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booked_hours: number
          course_id: string
          created_at: string | null
          end_time: string
          enrollment_id: string | null
          id: string
          instructor_profile_id: string
          is_active: boolean
          notes: string | null
          scheduled_date: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          student_profile_id: string
          time_slot_id: string | null
          updated_at: string | null
        }
        Insert: {
          booked_hours?: number
          course_id: string
          created_at?: string | null
          end_time: string
          enrollment_id?: string | null
          id?: string
          instructor_profile_id: string
          is_active?: boolean
          notes?: string | null
          scheduled_date: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_profile_id: string
          time_slot_id?: string | null
          updated_at?: string | null
        }
        Update: {
          booked_hours?: number
          course_id?: string
          created_at?: string | null
          end_time?: string
          enrollment_id?: string | null
          id?: string
          instructor_profile_id?: string
          is_active?: boolean
          notes?: string | null
          scheduled_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_profile_id?: string
          time_slot_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      consultation_offers: {
        Row: {
          created_at: string | null
          id: string
          instructor_profile_id: string
          is_active: boolean
          message: string | null
          offered_date: string
          offered_end_time: string
          offered_price: number
          offered_start_time: string
          request_id: string
          status: Database["public"]["Enums"]["consultation_offer_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          instructor_profile_id: string
          is_active?: boolean
          message?: string | null
          offered_date: string
          offered_end_time: string
          offered_price?: number
          offered_start_time: string
          request_id: string
          status?: Database["public"]["Enums"]["consultation_offer_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instructor_profile_id?: string
          is_active?: boolean
          message?: string | null
          offered_date?: string
          offered_end_time?: string
          offered_price?: number
          offered_start_time?: string
          request_id?: string
          status?: Database["public"]["Enums"]["consultation_offer_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_offers_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "consultation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          accepted_offer_id: string | null
          budget_max: number
          budget_min: number
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          level: string
          offers_count: number
          preferred_dates: Json | null
          preferred_times: Json | null
          status: Database["public"]["Enums"]["consultation_request_status"]
          student_profile_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          accepted_offer_id?: string | null
          budget_max?: number
          budget_min?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          level?: string
          offers_count?: number
          preferred_dates?: Json | null
          preferred_times?: Json | null
          status?: Database["public"]["Enums"]["consultation_request_status"]
          student_profile_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          accepted_offer_id?: string | null
          budget_max?: number
          budget_min?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          level?: string
          offers_count?: number
          preferred_dates?: Json | null
          preferred_times?: Json | null
          status?: Database["public"]["Enums"]["consultation_request_status"]
          student_profile_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_requests_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_accepted_offer"
            columns: ["accepted_offer_id"]
            isOneToOne: false
            referencedRelation: "consultation_offers"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          about_course: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          has_interactive_lab: boolean | null
          id: string
          instructor_profile_id: string | null
          interactive_lab_slug: string | null
          is_active: boolean
          is_featured: boolean
          is_live: boolean
          learning_outcomes: string[] | null
          level: string
          original_price: number | null
          price: number
          rating: number
          requirements: string[] | null
          slug: string
          syllabus: Json | null
          tags: string[] | null
          target_audience: string[] | null
          thumbnail_url: string | null
          title: string
          total_hours: number
          total_lessons: number
          total_reviews: number
          total_students: number
          updated_at: string | null
        }
        Insert: {
          about_course?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          has_interactive_lab?: boolean | null
          id?: string
          instructor_profile_id?: string | null
          interactive_lab_slug?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_live?: boolean
          learning_outcomes?: string[] | null
          level?: string
          original_price?: number | null
          price?: number
          rating?: number
          requirements?: string[] | null
          slug: string
          syllabus?: Json | null
          tags?: string[] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_hours?: number
          total_lessons?: number
          total_reviews?: number
          total_students?: number
          updated_at?: string | null
        }
        Update: {
          about_course?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          has_interactive_lab?: boolean | null
          id?: string
          instructor_profile_id?: string | null
          interactive_lab_slug?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_live?: boolean
          learning_outcomes?: string[] | null
          level?: string
          original_price?: number | null
          price?: number
          rating?: number
          requirements?: string[] | null
          slug?: string
          syllabus?: Json | null
          tags?: string[] | null
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_hours?: number
          total_lessons?: number
          total_reviews?: number
          total_students?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          id: string
          is_active: boolean
          status: Database["public"]["Enums"]["enrollment_status"]
          student_profile_id: string
          total_hours: number
          updated_at: string | null
          used_hours: number
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_profile_id: string
          total_hours?: number
          updated_at?: string | null
          used_hours?: number
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_profile_id?: string
          total_hours?: number
          updated_at?: string | null
          used_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          hourly_rate: number
          id: string
          is_accepting_students: boolean
          is_active: boolean
          is_online: boolean
          languages: string[] | null
          profile_id: string
          rating: number
          specializations: string[] | null
          title: string | null
          total_courses: number
          total_students: number
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          hourly_rate?: number
          id?: string
          is_accepting_students?: boolean
          is_active?: boolean
          is_online?: boolean
          languages?: string[] | null
          profile_id: string
          rating?: number
          specializations?: string[] | null
          title?: string | null
          total_courses?: number
          total_students?: number
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          hourly_rate?: number
          id?: string
          is_accepting_students?: boolean
          is_active?: boolean
          is_online?: boolean
          languages?: string[] | null
          profile_id?: string
          rating?: number
          specializations?: string[] | null
          title?: string | null
          total_courses?: number
          total_students?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          instructor_profile_id: string
          is_active: boolean
          max_viewers: number
          room_url: string | null
          scheduled_end: string | null
          scheduled_start: string
          status: Database["public"]["Enums"]["live_session_status"]
          title: string
          updated_at: string | null
          viewer_count: number
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          instructor_profile_id: string
          is_active?: boolean
          max_viewers?: number
          room_url?: string | null
          scheduled_end?: string | null
          scheduled_start: string
          status?: Database["public"]["Enums"]["live_session_status"]
          title: string
          updated_at?: string | null
          viewer_count?: number
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          instructor_profile_id?: string
          is_active?: boolean
          max_viewers?: number
          room_url?: string | null
          scheduled_end?: string | null
          scheduled_start?: string
          status?: Database["public"]["Enums"]["live_session_status"]
          title?: string
          updated_at?: string | null
          viewer_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "live_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_sessions_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          currency: string
          enrollment_id: string | null
          id: string
          payment_method: string
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string
          enrollment_id?: string | null
          id?: string
          payment_method: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          currency?: string
          enrollment_id?: string | null
          id?: string
          payment_method?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          profile_id: string
          role: Database["public"]["Enums"]["profile_role"]
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["profile_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_roles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }
        Insert: {
          address?: string | null
          auth_id: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Update: {
          address?: string | null
          auth_id?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          login_count?: number
          phone?: string | null
          preferences?: Json
          privacy_settings?: Json
          social_links?: Json | null
          updated_at?: string | null
          username?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          booked_course_id: string | null
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          instructor_profile_id: string
          is_active: boolean
          is_booked: boolean
          start_time: string
          updated_at: string | null
        }
        Insert: {
          booked_course_id?: string | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          instructor_profile_id: string
          is_active?: boolean
          is_booked?: boolean
          start_time: string
          updated_at?: string | null
        }
        Update: {
          booked_course_id?: string | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          instructor_profile_id?: string
          is_active?: boolean
          is_booked?: boolean
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_booked_course_id_fkey"
            columns: ["booked_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_slots_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_profile: {
        Args: { avatar_url?: string; full_name?: string; username: string }
        Returns: string
      }
      get_active_profile: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_active_profile_id: { Args: never; Returns: string }
      get_active_profile_role: {
        Args: never
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_auth_user_by_id: { Args: { p_id: string }; Returns: Json }
      get_paginated_users: {
        Args: { p_limit?: number; p_page?: number }
        Returns: Json
      }
      get_private_url: {
        Args: { bucket: string; expires_in?: number; object_path: string }
        Returns: string
      }
      get_profile_role: {
        Args: { profile_id: string }
        Returns: Database["public"]["Enums"]["profile_role"]
      }
      get_user_profiles: {
        Args: never
        Returns: {
          address: string | null
          auth_id: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean
          last_login: string | null
          login_count: number
          phone: string | null
          preferences: Json
          privacy_settings: Json
          social_links: Json | null
          updated_at: string | null
          username: string | null
          verification_status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      is_admin: { Args: never; Returns: boolean }
      is_instructor_or_admin: { Args: never; Returns: boolean }
      is_service_role: { Args: never; Returns: boolean }
      migrate_profile_roles: { Args: never; Returns: undefined }
      set_profile_active: { Args: { profile_id: string }; Returns: boolean }
      set_profile_role: {
        Args: {
          new_role: Database["public"]["Enums"]["profile_role"]
          target_profile_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      consultation_offer_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "withdrawn"
      consultation_request_status:
        | "open"
        | "in_progress"
        | "closed"
        | "cancelled"
      enrollment_status:
        | "pending"
        | "active"
        | "completed"
        | "expired"
        | "refunded"
      live_session_status: "scheduled" | "live" | "ended"
      profile_role: "student" | "instructor" | "admin"
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
    Enums: {
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      consultation_offer_status: [
        "pending",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      consultation_request_status: [
        "open",
        "in_progress",
        "closed",
        "cancelled",
      ],
      enrollment_status: [
        "pending",
        "active",
        "completed",
        "expired",
        "refunded",
      ],
      live_session_status: ["scheduled", "live", "ended"],
      profile_role: ["student", "instructor", "admin"],
    },
  },
} as const

