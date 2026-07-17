import { z } from 'zod';
import type { Database } from '@/types/database.types';

export type JournalEntryRow    = Database['public']['Tables']['journal_entries']['Row'];
export type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert'];
export type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update'];
export type MoodEnum           = Database['public']['Enums']['mood_enum'];

export const journalEntrySchema = z.object({
  title:         z.string().max(200).default(''),
  content:       z.string().default(''),
  date:          z.string().min(1, 'Date is required'),
  location_name: z.string().max(200).default(''),
  mood:          z.string().default(''),
  rating:        z.number().int().min(1).max(5).nullable(),
  is_favourite:  z.boolean().default(false),
  is_public:     z.boolean().default(false),
});

export type JournalFormValues = z.infer<typeof journalEntrySchema>;

export interface JournalFilters {
  search:        string;
  rating:        number | null;
  favouriteOnly: boolean;
  sortOrder:     'newest' | 'oldest';
}
