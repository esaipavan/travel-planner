import { supabase } from '@/lib/supabase';
import type { ReminderRow, ReminderInsert, ReminderUpdate } from '../types';

export async function getReminders(userId: string): Promise<ReminderRow[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('reminder_date', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createReminder(reminder: ReminderInsert): Promise<ReminderRow> {
  const { data, error } = await supabase
    .from('reminders')
    .insert(reminder)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateReminder(id: string, update: ReminderUpdate): Promise<ReminderRow> {
  const { data, error } = await supabase
    .from('reminders')
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteReminder(id: string): Promise<void> {
  const { error } = await supabase.from('reminders').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
