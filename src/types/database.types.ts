export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          home_currency: string;
          preferred_language: string;
          dark_mode: boolean;
          user_role: Database['public']['Enums']['user_role_enum'];
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          home_currency?: string;
          preferred_language?: string;
          dark_mode?: boolean;
          user_role?: Database['public']['Enums']['user_role_enum'];
          notifications_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          home_currency?: string;
          preferred_language?: string;
          dark_mode?: boolean;
          user_role?: Database['public']['Enums']['user_role_enum'];
          notifications_enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          country_code: string | null;
          cover_image_url: string | null;
          latitude: number | null;
          longitude: number | null;
          start_date: string;
          end_date: string;
          status: Database['public']['Enums']['trip_status'];
          total_budget: number | null;
          currency: string;
          notes: string | null;
          is_public: boolean;
          is_favourite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          destination: string;
          country_code?: string | null;
          cover_image_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          start_date: string;
          end_date: string;
          status?: Database['public']['Enums']['trip_status'];
          total_budget?: number | null;
          currency?: string;
          notes?: string | null;
          is_public?: boolean;
          is_favourite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          destination?: string;
          country_code?: string | null;
          cover_image_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          start_date?: string;
          end_date?: string;
          status?: Database['public']['Enums']['trip_status'];
          total_budget?: number | null;
          currency?: string;
          notes?: string | null;
          is_public?: boolean;
          is_favourite?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trips_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      trip_budgets: {
        Row: {
          id: string;
          trip_id: string;
          category: Database['public']['Enums']['expense_category'];
          allocated_amount: number;
          currency: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          category: Database['public']['Enums']['expense_category'];
          allocated_amount: number;
          currency?: string;
        };
        Update: {
          allocated_amount?: number;
          currency?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'trip_budgets_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
        ];
      };
      expenses: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          category: Database['public']['Enums']['expense_category'];
          title: string;
          amount: number;
          currency: string;
          date: string;
          notes: string | null;
          receipt_url: string | null;
          payment_method: Database['public']['Enums']['payment_method'] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          category: Database['public']['Enums']['expense_category'];
          title: string;
          amount: number;
          currency?: string;
          date: string;
          notes?: string | null;
          receipt_url?: string | null;
          payment_method?: Database['public']['Enums']['payment_method'] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category?: Database['public']['Enums']['expense_category'];
          title?: string;
          amount?: number;
          currency?: string;
          date?: string;
          notes?: string | null;
          receipt_url?: string | null;
          payment_method?: Database['public']['Enums']['payment_method'] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'expenses_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'expenses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      itinerary_days: {
        Row: {
          id: string;
          trip_id: string;
          day_number: number;
          date: string;
          title: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          trip_id: string;
          day_number: number;
          date: string;
          title?: string | null;
          notes?: string | null;
        };
        Update: {
          title?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'itinerary_days_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
        ];
      };
      itinerary_items: {
        Row: {
          id: string;
          day_id: string;
          title: string;
          description: string | null;
          start_time: string | null;
          end_time: string | null;
          location_name: string | null;
          latitude: number | null;
          longitude: number | null;
          category: Database['public']['Enums']['itinerary_category'];
          estimated_cost: number | null;
          status: Database['public']['Enums']['item_status'];
          order_index: number;
        };
        Insert: {
          id?: string;
          day_id: string;
          title: string;
          description?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          category?: Database['public']['Enums']['itinerary_category'];
          estimated_cost?: number | null;
          status?: Database['public']['Enums']['item_status'];
          order_index?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          location_name?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          category?: Database['public']['Enums']['itinerary_category'];
          estimated_cost?: number | null;
          status?: Database['public']['Enums']['item_status'];
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'itinerary_items_day_id_fkey';
            columns: ['day_id'];
            isOneToOne: false;
            referencedRelation: 'itinerary_days';
            referencedColumns: ['id'];
          },
        ];
      };
      packing_items: {
        Row: {
          id: string;
          trip_id: string;
          name: string;
          category: string | null;
          quantity: number;
          is_packed: boolean;
          is_essential: boolean;
          order_index: number;
        };
        Insert: {
          id?: string;
          trip_id: string;
          name: string;
          category?: string | null;
          quantity?: number;
          is_packed?: boolean;
          is_essential?: boolean;
          order_index?: number;
        };
        Update: {
          name?: string;
          category?: string | null;
          quantity?: number;
          is_packed?: boolean;
          is_essential?: boolean;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'packing_items_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
        ];
      };
      journal_entries: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          title: string | null;
          content: string | null;
          date: string;
          mood: Database['public']['Enums']['mood_enum'] | null;
          image_urls: string[] | null;
          location_name: string | null;
          is_public: boolean;
          rating: number | null;
          is_favourite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id: string;
          title?: string | null;
          content?: string | null;
          date: string;
          mood?: Database['public']['Enums']['mood_enum'] | null;
          image_urls?: string[] | null;
          location_name?: string | null;
          is_public?: boolean;
          rating?: number | null;
          is_favourite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          content?: string | null;
          date?: string;
          mood?: Database['public']['Enums']['mood_enum'] | null;
          image_urls?: string[] | null;
          location_name?: string | null;
          is_public?: boolean;
          rating?: number | null;
          is_favourite?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'journal_entries_trip_id_fkey';
            columns: ['trip_id'];
            isOneToOne: false;
            referencedRelation: 'trips';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'journal_entries_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      travel_documents: {
        Row: {
          id: string;
          user_id: string;
          trip_id: string | null;
          type: Database['public']['Enums']['document_type'];
          name: string;
          file_url: string;
          file_size: number | null;
          expiry_date: string | null;
          notes: string | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trip_id?: string | null;
          type: Database['public']['Enums']['document_type'];
          name: string;
          file_url: string;
          file_size?: number | null;
          expiry_date?: string | null;
          notes?: string | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          trip_id?: string | null;
          type?: Database['public']['Enums']['document_type'];
          name?: string;
          expiry_date?: string | null;
          notes?: string | null;
          country?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'travel_documents_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      feedback: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          subject: string;
          message: string;
          status: string;
          admin_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          subject: string;
          message: string;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
        };
        Update: {
          status?: string;
          admin_notes?: string | null;
        };
        Relationships: [];
      };
      bug_reports: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          steps_to_reproduce: string | null;
          severity: string;
          status: string;
          browser_info: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description: string;
          steps_to_reproduce?: string | null;
          severity?: string;
          status?: string;
          browser_info?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          severity?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          is_enabled: boolean;
          rollout_percentage: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          is_enabled?: boolean;
          rollout_percentage?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          description?: string | null;
          is_enabled?: boolean;
          rollout_percentage?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          user_id: string | null;
          provider: string;
          model: string;
          prompt_tokens: number | null;
          completion_tokens: number | null;
          latency_ms: number | null;
          success: boolean;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          provider: string;
          model: string;
          prompt_tokens?: number | null;
          completion_tokens?: number | null;
          latency_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          trip_id: string | null;
          title: string;
          description: string | null;
          type: Database['public']['Enums']['reminder_type'];
          reminder_date: string;
          reminder_time: string | null;
          priority: Database['public']['Enums']['reminder_priority'];
          status: Database['public']['Enums']['reminder_status'];
          repeat: Database['public']['Enums']['reminder_repeat'];
          is_snoozed: boolean;
          snoozed_until: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trip_id?: string | null;
          title: string;
          description?: string | null;
          type?: Database['public']['Enums']['reminder_type'];
          reminder_date: string;
          reminder_time?: string | null;
          priority?: Database['public']['Enums']['reminder_priority'];
          status?: Database['public']['Enums']['reminder_status'];
          repeat?: Database['public']['Enums']['reminder_repeat'];
          is_snoozed?: boolean;
          snoozed_until?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          trip_id?: string | null;
          title?: string;
          description?: string | null;
          type?: Database['public']['Enums']['reminder_type'];
          reminder_date?: string;
          reminder_time?: string | null;
          priority?: Database['public']['Enums']['reminder_priority'];
          status?: Database['public']['Enums']['reminder_status'];
          repeat?: Database['public']['Enums']['reminder_repeat'];
          is_snoozed?: boolean;
          snoozed_until?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reminders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role_enum: 'user' | 'admin' | 'super_admin';
      trip_status: 'planning' | 'active' | 'completed' | 'cancelled';
      expense_category:
        | 'hotel'
        | 'food'
        | 'transport'
        | 'shopping'
        | 'activity'
        | 'emergency'
        | 'fuel'
        | 'taxi'
        | 'misc';
      itinerary_category: 'transport' | 'accommodation' | 'activity' | 'food' | 'other';
      item_status: 'planned' | 'confirmed' | 'completed' | 'cancelled';
      mood_enum: 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';
      document_type:
        | 'passport'
        | 'visa'
        | 'ticket'
        | 'flight_ticket'
        | 'train_ticket'
        | 'bus_ticket'
        | 'hotel'
        | 'insurance'
        | 'vaccination'
        | 'driving_license'
        | 'other';
      payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';
      reminder_type:
        | 'passport'
        | 'visa'
        | 'flight'
        | 'hotel'
        | 'packing'
        | 'payment'
        | 'insurance'
        | 'vaccination'
        | 'check_in'
        | 'custom';
      reminder_priority: 'low' | 'medium' | 'high';
      reminder_status: 'pending' | 'completed';
      reminder_repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    };
    CompositeTypes: Record<string, never>;
  };
};
