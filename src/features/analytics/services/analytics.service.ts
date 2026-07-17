import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

export type AnalyticsExpense = Database['public']['Tables']['expenses']['Row'];
export type AnalyticsJournal = Database['public']['Tables']['journal_entries']['Row'];

export async function getAllExpenses(userId: string): Promise<AnalyticsExpense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAllJournalEntries(userId: string): Promise<AnalyticsJournal[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
