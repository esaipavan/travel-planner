import type { Database } from '@/types/database.types';

export type ItineraryDayRow    = Database['public']['Tables']['itinerary_days']['Row'];
export type ItineraryItemRow   = Database['public']['Tables']['itinerary_items']['Row'];
export type ItineraryItemInsert = Database['public']['Tables']['itinerary_items']['Insert'];
export type ItineraryItemUpdate = Database['public']['Tables']['itinerary_items']['Update'];
export type ItineraryCategory  = Database['public']['Enums']['itinerary_category'];
export type ItemStatus         = Database['public']['Enums']['item_status'];

export interface ItineraryDay extends ItineraryDayRow {
  items: ItineraryItemRow[];
}

export interface ItineraryData {
  tripTitle: string;
  tripCurrency: string;
  startDate: string;
  endDate: string;
  days: ItineraryDay[];
}

export interface ItemFormValues {
  title: string;
  category: ItineraryCategory;
  status: ItemStatus;
  start_time: string;
  end_time: string;
  location_name: string;
  description: string;
  estimated_cost: string;
}
