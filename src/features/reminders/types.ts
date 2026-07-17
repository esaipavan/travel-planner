import { z } from 'zod';
import type { Database } from '@/types/database.types';

export type ReminderType     = Database['public']['Enums']['reminder_type'];
export type ReminderPriority = Database['public']['Enums']['reminder_priority'];
export type ReminderStatus   = Database['public']['Enums']['reminder_status'];
export type ReminderRepeat   = Database['public']['Enums']['reminder_repeat'];
export type ReminderRow      = Database['public']['Tables']['reminders']['Row'];
export type ReminderInsert   = Database['public']['Tables']['reminders']['Insert'];
export type ReminderUpdate   = Database['public']['Tables']['reminders']['Update'];

export type EffectiveStatus = 'pending' | 'completed' | 'overdue';
export type ReminderView    = 'card' | 'list' | 'calendar';

// ── Metadata tables ───────────────────────────────────────────────────────────

export interface ReminderTypeMeta {
  value: ReminderType;
  label: string;
  emoji: string;
}

export const REMINDER_TYPES: ReminderTypeMeta[] = [
  { value: 'passport',    label: 'Passport',    emoji: '🛂' },
  { value: 'visa',        label: 'Visa',        emoji: '📋' },
  { value: 'flight',      label: 'Flight',      emoji: '✈️' },
  { value: 'hotel',       label: 'Hotel',       emoji: '🏨' },
  { value: 'packing',     label: 'Packing',     emoji: '🧳' },
  { value: 'payment',     label: 'Payment',     emoji: '💳' },
  { value: 'insurance',   label: 'Insurance',   emoji: '🛡️' },
  { value: 'vaccination', label: 'Vaccination', emoji: '💉' },
  { value: 'check_in',    label: 'Check-in',    emoji: '✅' },
  { value: 'custom',      label: 'Custom',      emoji: '📌' },
];

export const REMINDER_TYPE_MAP = Object.fromEntries(
  REMINDER_TYPES.map((t) => [t.value, t]),
) as Record<ReminderType, ReminderTypeMeta>;

export const PRIORITY_CONFIG: Record<
  ReminderPriority,
  { label: string; dotClass: string; badgeClass: string }
> = {
  low:    {
    label:      'Low',
    dotClass:   'bg-muted-foreground',
    badgeClass: 'bg-muted/50 text-muted-foreground border-muted',
  },
  medium: {
    label:      'Medium',
    dotClass:   'bg-amber-500',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400',
  },
  high:   {
    label:      'High',
    dotClass:   'bg-destructive',
    badgeClass: 'bg-destructive/10 text-destructive border-destructive/30',
  },
};

export const STATUS_CONFIG: Record<
  EffectiveStatus,
  { label: string; badgeClass: string }
> = {
  pending:   { label: 'Pending',   badgeClass: 'bg-primary/10 text-primary border-primary/30' },
  completed: { label: 'Completed', badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400' },
  overdue:   { label: 'Overdue',   badgeClass: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export const REPEAT_OPTIONS: { value: ReminderRepeat; label: string }[] = [
  { value: 'none',    label: 'No repeat' },
  { value: 'daily',   label: 'Daily' },
  { value: 'weekly',  label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly',  label: 'Yearly' },
];

export const PRIORITY_ORDER: Record<ReminderPriority, number> = {
  high: 0, medium: 1, low: 2,
};

// ── Computed helpers ──────────────────────────────────────────────────────────

export function getEffectiveStatus(
  reminder: Pick<ReminderRow, 'status' | 'reminder_date' | 'reminder_time' | 'is_snoozed' | 'snoozed_until'>,
): EffectiveStatus {
  if (reminder.status === 'completed') return 'completed';

  if (reminder.is_snoozed && reminder.snoozed_until) {
    if (new Date(reminder.snoozed_until) > new Date()) return 'pending';
  }

  const dateStr = reminder.reminder_time
    ? `${reminder.reminder_date}T${reminder.reminder_time}`
    : `${reminder.reminder_date}T23:59:59`;

  return new Date(dateStr) < new Date() ? 'overdue' : 'pending';
}

export function isReminderDueNow(reminder: ReminderRow): boolean {
  if (reminder.status === 'completed') return false;
  if (!reminder.reminder_time) return false;
  const due  = new Date(`${reminder.reminder_date}T${reminder.reminder_time}`);
  const now  = new Date();
  const diff = due.getTime() - now.getTime();
  return diff >= 0 && diff < 60_000;
}

// ── Form schema ───────────────────────────────────────────────────────────────

export const reminderFormSchema = z.object({
  title:         z.string().min(1, 'Title is required').max(200),
  description:   z.string().max(1000).default(''),
  trip_id:       z.string().nullable().default(null),
  type:          z.string().min(1, 'Type is required'),
  reminder_date: z.string().min(1, 'Date is required'),
  reminder_time: z.string().nullable().default(null),
  priority:      z.enum(['low', 'medium', 'high'] as const).default('medium'),
  repeat:        z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly'] as const).default('none'),
});

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;

// ── Filter / sort types ───────────────────────────────────────────────────────

export interface ReminderFilters {
  search:    string;
  tripId:    string;
  type:      string;
  priority:  string;
  status:    string;
  upcoming:  boolean;
  sortOrder: 'newest' | 'oldest' | 'date' | 'priority';
}
