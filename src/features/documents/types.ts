import { z } from 'zod';
import type { Database } from '@/types/database.types';

export type TravelDocumentRow    = Database['public']['Tables']['travel_documents']['Row'];
export type TravelDocumentInsert = Database['public']['Tables']['travel_documents']['Insert'];
export type TravelDocumentUpdate = Database['public']['Tables']['travel_documents']['Update'];
export type DocumentType         = Database['public']['Enums']['document_type'];

export type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired' | 'no_expiry';

export interface DocTypeMeta {
  value: DocumentType;
  label: string;
  emoji: string;
}

export const DOCUMENT_TYPES: DocTypeMeta[] = [
  { value: 'passport',        label: 'Passport',                emoji: '🛂' },
  { value: 'visa',            label: 'Visa',                    emoji: '📋' },
  { value: 'flight_ticket',   label: 'Flight Ticket',           emoji: '✈️' },
  { value: 'train_ticket',    label: 'Train Ticket',            emoji: '🚆' },
  { value: 'bus_ticket',      label: 'Bus Ticket',              emoji: '🚌' },
  { value: 'hotel',           label: 'Hotel Booking',           emoji: '🏨' },
  { value: 'insurance',       label: 'Travel Insurance',        emoji: '🛡️' },
  { value: 'vaccination',     label: 'Vaccination Certificate', emoji: '💉' },
  { value: 'driving_license', label: 'Driving License',         emoji: '🪪' },
  { value: 'ticket',          label: 'Ticket',                  emoji: '🎫' },
  { value: 'other',           label: 'Other',                   emoji: '📄' },
];

export const DOC_TYPE_MAP = Object.fromEntries(
  DOCUMENT_TYPES.map((d) => [d.value, d]),
) as Record<DocumentType, DocTypeMeta>;

export const documentFormSchema = z.object({
  name:        z.string().min(1, 'Title is required').max(200),
  type:        z.string().min(1, 'Document type is required'),
  trip_id:     z.string().nullable().default(null),
  country:     z.string().max(100).default(''),
  expiry_date: z.string().nullable().default(null),
  notes:       z.string().default(''),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

export interface DocumentFilters {
  search:       string;
  type:         string;
  tripId:       string;
  expiringSoon: boolean;
  sortOrder:    'newest' | 'oldest';
}

export const MAX_FILE_SIZE    = 10 * 1024 * 1024; // 10 MB
export const ACCEPTED_TYPES   = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'] as const;
export const ACCEPTED_EXT_STR = '.pdf,.jpg,.jpeg,.png';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getExpiryStatus(expiryDate: string | null): ExpiryStatus {
  if (!expiryDate) return 'no_expiry';
  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  const days   = Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000);
  if (days < 0)   return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'valid';
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024)             return `${bytes} B`;
  if (bytes < 1024 * 1024)      return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp)(\?|$)/i.test(url);
}

export function isPdfUrl(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url);
}
