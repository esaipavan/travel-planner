export type { Database } from './database.types';

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export type ExpenseCategory =
  | 'hotel'
  | 'food'
  | 'transport'
  | 'shopping'
  | 'activity'
  | 'emergency'
  | 'fuel'
  | 'taxi'
  | 'misc';

export type ItineraryCategory =
  | 'transport'
  | 'accommodation'
  | 'activity'
  | 'food'
  | 'other';

export type ItemStatus = 'planned' | 'confirmed' | 'completed' | 'cancelled';

export type MoodEnum = 'amazing' | 'good' | 'okay' | 'bad' | 'terrible';

export type DocumentType =
  | 'passport'
  | 'visa'
  | 'ticket'
  | 'hotel'
  | 'insurance'
  | 'other';

export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer' | 'other';

export type AIProvider = 'groq' | 'gemini' | 'openrouter';

export interface ApiError {
  message: string;
  code?: string;
}
