import { z } from 'zod';
import type { Database } from '@/types/database.types';

export type ProfileRow    = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type ThemeValue = 'light' | 'dark' | 'system';

// ── Form schema ───────────────────────────────────────────────────────────────

export const profileFormSchema = z.object({
  full_name:          z.string().min(1, 'Name is required').max(100),
  username:           z
    .string()
    .max(30)
    .regex(/^[a-z0-9_]*$/, 'Lowercase letters, numbers, and underscores only')
    .optional()
    .or(z.literal('')),
  phone_number:       z.string().max(20).optional().or(z.literal('')),
  date_of_birth:      z.string().optional().or(z.literal('')),
  gender:             z.string().optional().or(z.literal('')),
  country:            z.string().max(100).optional().or(z.literal('')),
  city:               z.string().max(100).optional().or(z.literal('')),
  bio:                z.string().max(200, 'Bio must be 200 characters or less').optional().or(z.literal('')),
  preferred_language: z.string(),
  home_currency:      z.string(),
  time_zone:          z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// ── Static option lists ───────────────────────────────────────────────────────

export const LANGUAGES: { value: string; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ko', label: 'Korean' },
  { value: 'it', label: 'Italian' },
  { value: 'ru', label: 'Russian' },
];

export const TIMEZONES: { value: string; label: string }[] = [
  { value: 'UTC',                   label: 'UTC (Coordinated Universal Time)' },
  { value: 'Asia/Kolkata',          label: 'IST — India Standard Time (UTC+5:30)' },
  { value: 'America/New_York',      label: 'EST — New York (UTC-5)' },
  { value: 'America/Chicago',       label: 'CST — Chicago (UTC-6)' },
  { value: 'America/Denver',        label: 'MST — Denver (UTC-7)' },
  { value: 'America/Los_Angeles',   label: 'PST — Los Angeles (UTC-8)' },
  { value: 'America/Sao_Paulo',     label: 'BRT — São Paulo (UTC-3)' },
  { value: 'Europe/London',         label: 'GMT — London (UTC+0)' },
  { value: 'Europe/Paris',          label: 'CET — Paris/Berlin (UTC+1)' },
  { value: 'Europe/Moscow',         label: 'MSK — Moscow (UTC+3)' },
  { value: 'Asia/Dubai',            label: 'GST — Dubai (UTC+4)' },
  { value: 'Asia/Bangkok',          label: 'ICT — Bangkok (UTC+7)' },
  { value: 'Asia/Singapore',        label: 'SGT — Singapore (UTC+8)' },
  { value: 'Asia/Tokyo',            label: 'JST — Tokyo (UTC+9)' },
  { value: 'Australia/Sydney',      label: 'AEST — Sydney (UTC+10)' },
  { value: 'Pacific/Auckland',      label: 'NZST — Auckland (UTC+12)' },
];

export const DATE_FORMATS: { value: string; label: string; example: string }[] = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY', example: '25/01/2025' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY', example: '01/25/2025' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD', example: '2025-01-25' },
  { value: 'dd MMM yyyy', label: 'DD MMM YYYY', example: '25 Jan 2025' },
  { value: 'MMM dd, yyyy', label: 'MMM DD, YYYY', example: 'Jan 25, 2025' },
];

export const GENDER_OPTIONS: { value: string; label: string }[] = [
  { value: 'male',          label: 'Male' },
  { value: 'female',        label: 'Female' },
  { value: 'non_binary',    label: 'Non-binary' },
  { value: 'prefer_not',    label: 'Prefer not to say' },
];

export const DISTANCE_UNITS: { value: string; label: string }[] = [
  { value: 'km',    label: 'Kilometres (km)' },
  { value: 'miles', label: 'Miles' },
];

export const TEMPERATURE_UNITS: { value: string; label: string }[] = [
  { value: 'celsius',    label: 'Celsius (°C)' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
];

export const THEME_OPTIONS: { value: ThemeValue; label: string }[] = [
  { value: 'light',  label: 'Light' },
  { value: 'dark',   label: 'Dark' },
  { value: 'system', label: 'System default' },
];
