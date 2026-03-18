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
      achievement_definitions: {
        Row: {
          category: Database["public"]["Enums"]["achievement_category"]
          created_at: string | null
          description: string
          icon: string
          id: string
          is_active: boolean
          label: string
          max_progress: number
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["achievement_category"]
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          label: string
          max_progress?: number
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          label?: string
          max_progress?: number
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          body: string | null
          category: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_published: boolean
          published_at: string | null
          read_time_minutes: number
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string
          body?: string | null
          category?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_published?: boolean
          published_at?: string | null
          read_time_minutes?: number
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          body?: string | null
          category?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_published?: boolean
          published_at?: string | null
          read_time_minutes?: number
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booked_hours: number
          course_id: string
          created_at: string | null
          end_time: string
          enrollment_id: string | null
          id: string
          instructor_availability_id: string | null
          instructor_profile_id: string
          is_active: boolean
          notes: string | null
          scheduled_date: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          student_profile_id: string
          updated_at: string | null
        }
        Insert: {
          booked_hours?: number
          course_id: string
          created_at?: string | null
          end_time: string
          enrollment_id?: string | null
          id?: string
          instructor_availability_id?: string | null
          instructor_profile_id: string
          is_active?: boolean
          notes?: string | null
          scheduled_date: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_profile_id: string
          updated_at?: string | null
        }
        Update: {
          booked_hours?: number
          course_id?: string
          created_at?: string | null
          end_time?: string
          enrollment_id?: string | null
          id?: string
          instructor_availability_id?: string | null
          instructor_profile_id?: string
          is_active?: boolean
          notes?: string | null
          scheduled_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          student_profile_id?: string
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
            foreignKeyName: "bookings_instructor_availability_id_fkey"
            columns: ["instructor_availability_id"]
            isOneToOne: false
            referencedRelation: "instructor_availabilities"
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
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_draft: boolean | null
          role: string
          session_id: string
          status: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_draft?: boolean | null
          role: string
          session_id: string
          status?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_draft?: boolean | null
          role?: string
          session_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          auto_reply: boolean | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          auto_reply?: boolean | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          auto_reply?: boolean | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
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
      content_pages: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_active: boolean
          last_updated: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          last_updated?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          last_updated?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupon_usages: {
        Row: {
          coupon_id: string
          created_at: string | null
          discount_applied: number
          id: string
          payment_id: string
          user_profile_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string | null
          discount_applied: number
          id?: string
          payment_id: string
          user_profile_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string | null
          discount_applied?: number
          id?: string
          payment_id?: string
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usages_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usages_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          min_purchase_amount: number | null
          per_user_limit: number | null
          type: string
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          per_user_limit?: number | null
          type: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          per_user_limit?: number | null
          type?: string
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          about_course: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          has_interactive_lab: boolean | null
          id: string
          interactive_lab_slug: string | null
          is_active: boolean
          is_featured: boolean
          is_live_feature: boolean
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
          interactive_lab_slug?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_live_feature?: boolean
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
          interactive_lab_slug?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_live_feature?: boolean
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
      events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          event_time: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          event_time: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_time?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string | null
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string | null
          email: string | null
          id: string
          is_read: boolean
          message: string
          profile_id: string | null
          topic: string
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean
          message: string
          profile_id?: string | null
          topic: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean
          message?: string
          profile_id?: string | null
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_availabilities: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          instructor_profile_id: string
          is_active: boolean
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          instructor_profile_id: string
          is_active?: boolean
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          instructor_profile_id?: string
          is_active?: boolean
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_availabilities_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_courses: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          instructor_profile_id: string
          is_primary: boolean
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          instructor_profile_id: string
          is_primary?: boolean
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          instructor_profile_id?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "instructor_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_courses_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
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
      instructor_reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          course_id: string | null
          created_at: string | null
          id: string
          instructor_profile_id: string
          is_active: boolean
          rating: number
          student_profile_id: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_profile_id: string
          is_active?: boolean
          rating: number
          student_profile_id: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          instructor_profile_id?: string
          is_active?: boolean
          rating?: number
          student_profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructor_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_reviews_instructor_profile_id_fkey"
            columns: ["instructor_profile_id"]
            isOneToOne: false
            referencedRelation: "instructor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_reviews_student_profile_id_fkey"
            columns: ["student_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_instructor: boolean | null
          live_session_id: string
          profile_id: string
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_instructor?: boolean | null
          live_session_id: string
          profile_id: string
          text: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_instructor?: boolean | null
          live_session_id?: string
          profile_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_chat_messages_live_session_id_fkey"
            columns: ["live_session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_chat_messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      live_session_participants: {
        Row: {
          id: string
          joined_at: string | null
          left_at: string | null
          live_session_id: string
          profile_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          live_session_id: string
          profile_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          left_at?: string | null
          live_session_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_session_participants_live_session_id_fkey"
            columns: ["live_session_id"]
            isOneToOne: false
            referencedRelation: "live_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_session_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
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
          coupon_id: string | null
          course_id: string | null
          created_at: string | null
          currency: string
          discount_amount: number | null
          enrollment_id: string | null
          id: string
          original_amount: number
          payment_method: string
          status: string
          transaction_id: string | null
          updated_at: string | null
          user_profile_id: string
        }
        Insert: {
          amount: number
          coupon_id?: string | null
          course_id?: string | null
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          enrollment_id?: string | null
          id?: string
          original_amount: number
          payment_method: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_profile_id: string
        }
        Update: {
          amount?: number
          coupon_id?: string | null
          course_id?: string | null
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          enrollment_id?: string | null
          id?: string
          original_amount?: number
          payment_method?: string
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
          user_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string | null
          id: string
          profile_id: string
          progress: number
          unlocked_at: string | null
          updated_at: string | null
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          id?: string
          profile_id: string
          progress?: number
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          progress?: number
          unlocked_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievement_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          status: string
          type: string
          updated_at: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          type: string
          updated_at?: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          type?: string
          updated_at?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
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
      create_profile: {
        Args: { avatar_url?: string; full_name?: string; username: string }
        Returns: string
      }
      credit_wallet: {
        Args: {
          p_amount: number
          p_description?: string
          p_profile_id: string
          p_reference_id?: string
          p_reference_type?: string
          p_type?: string
        }
        Returns: string
      }
      fulfill_stripe_payment: {
        Args: {
          p_instructor_id: string
          p_payment_id: string
          p_scheduled_date: string
          p_slot_id: string
          p_transaction_id: string
        }
        Returns: Json
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
      pay_with_wallet: {
        Args: {
          p_amount: number
          p_description?: string
          p_profile_id: string
          p_reference_id?: string
          p_reference_type?: string
        }
        Returns: string
      }
      process_wizard_transaction: {
        Args: {
          p_coupon_code?: string
          p_course_id: string
          p_date: string
          p_instructor_id: string
          p_payment_method?: string
          p_slot_id: string
        }
        Returns: Json
      }
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
      achievement_category: "learning" | "consistency" | "social" | "milestone"
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
      achievement_category: ["learning", "consistency", "social", "milestone"],
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

