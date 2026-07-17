import type { Database } from '@/types/database.types';

export type PackingItemRow    = Database['public']['Tables']['packing_items']['Row'];
export type PackingItemInsert = Database['public']['Tables']['packing_items']['Insert'];
export type PackingItemUpdate = Database['public']['Tables']['packing_items']['Update'];

export const PACKING_CATEGORIES = [
  { value: 'Documents',    emoji: '📄' },
  { value: 'Clothing',     emoji: '👕' },
  { value: 'Electronics',  emoji: '🔌' },
  { value: 'Toiletries',   emoji: '🧴' },
  { value: 'Medicines',    emoji: '💊' },
  { value: 'Accessories',  emoji: '💼' },
  { value: 'Food',         emoji: '🍱' },
  { value: 'Other',        emoji: '📦' },
] as const;

export type PackingCategory = (typeof PACKING_CATEGORIES)[number]['value'];

export type FilterStatus = 'all' | 'packed' | 'unpacked';

export interface ItemFormValues {
  name:         string;
  category:     string;
  quantity:     string;
  is_essential: boolean;
}

export interface CategoryProgress {
  category:  string;
  emoji:     string;
  total:     number;
  packed:    number;
}

export interface ChecklistData {
  tripTitle: string;
  items:     PackingItemRow[];
}
