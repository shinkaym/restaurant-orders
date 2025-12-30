import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register validation schema
export const registerSchema = z.object({
  // Required fields
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters'),

  // Optional fields
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 characters')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  zip_code: z
    .string()
    .min(3, 'Zip code must be at least 3 characters')
    .optional()
    .or(z.literal('')),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
