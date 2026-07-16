import { z } from 'zod';
import { ALLOWED_DOCUMENT_TYPES, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from './constants';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const imageFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, `File must be under 10MB`)
  .refine(
    (f) => ALLOWED_IMAGE_TYPES.includes(f.type),
    'Only JPG, PNG, and WebP images are allowed',
  );

export const documentFileSchema = z
  .instanceof(File)
  .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, `File must be under 10MB`)
  .refine(
    (f) => ALLOWED_DOCUMENT_TYPES.includes(f.type),
    'Only JPG, PNG, WebP, and PDF files are allowed',
  );

export const currencySchema = z
  .string()
  .length(3, 'Currency must be a 3-letter code')
  .toUpperCase();

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format');

export const positiveNumberSchema = z
  .number({ invalid_type_error: 'Must be a number' })
  .positive('Must be greater than 0');

export const nonNegativeNumberSchema = z
  .number({ invalid_type_error: 'Must be a number' })
  .min(0, 'Cannot be negative');
