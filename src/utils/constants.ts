import type { ExpenseCategory, ItineraryCategory, DocumentType, PaymentMethod } from '@/types';

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'TravelPlanner';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  TRIPS: '/trips',
  TRIP_DETAIL: '/trips/:id',
  TRIP_NEW: '/trips/new',
  BUDGET: '/trips/:id/budget',
  EXPENSES: '/trips/:id/expenses',
  ITINERARY: '/trips/:id/itinerary',
  CHECKLIST: '/trips/:id/checklist',
  JOURNAL: '/trips/:id/journal',
  WEATHER: '/weather',
  CURRENCY: '/currency',
  NEARBY: '/nearby',
  DESTINATION: '/destination',
  DOCUMENTS: '/documents',
  ASSISTANT: '/assistant',
  ANALYTICS: '/analytics',
  EXPORT: '/trips/:id/export',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SHARE: '/share/:id',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_FEEDBACK: '/admin/feedback',
  ADMIN_BUGS: '/admin/bugs',
  ADMIN_FLAGS: '/admin/flags',
  ADMIN_HEALTH: '/admin/health',
  ADMIN_AI: '/admin/ai',
} as const;

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'hotel', label: 'Hotel', emoji: '🏨' },
  { value: 'food', label: 'Food & Drink', emoji: '🍽️' },
  { value: 'transport', label: 'Transport', emoji: '✈️' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'activity', label: 'Activity', emoji: '🎯' },
  { value: 'fuel', label: 'Fuel', emoji: '⛽' },
  { value: 'taxi', label: 'Taxi / Cab', emoji: '🚕' },
  { value: 'emergency', label: 'Emergency', emoji: '🚨' },
  { value: 'misc', label: 'Miscellaneous', emoji: '📦' },
];

export const ITINERARY_CATEGORIES: { value: ItineraryCategory; label: string; emoji: string }[] = [
  { value: 'transport', label: 'Transport', emoji: '✈️' },
  { value: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { value: 'activity', label: 'Activity', emoji: '🎯' },
  { value: 'food', label: 'Food', emoji: '🍽️' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

export const DOCUMENT_TYPES: { value: DocumentType; label: string; emoji: string }[] = [
  { value: 'passport', label: 'Passport', emoji: '📘' },
  { value: 'visa', label: 'Visa', emoji: '🛂' },
  { value: 'ticket', label: 'Ticket', emoji: '🎫' },
  { value: 'hotel', label: 'Hotel Booking', emoji: '🏨' },
  { value: 'insurance', label: 'Insurance', emoji: '🛡️' },
  { value: 'other', label: 'Other', emoji: '📄' },
];

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];

export const SUPPORTED_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD',
  'HKD', 'NOK', 'SEK', 'DKK', 'NZD', 'MXN', 'BRL', 'ZAR', 'AED', 'THB',
  'MYR', 'IDR', 'PHP', 'KRW', 'TRY', 'PLN', 'CZK', 'HUF', 'ILS', 'RUB',
  'SAR', 'BGN',
] as const;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];
