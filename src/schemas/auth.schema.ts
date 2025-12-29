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
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .min(10, 'Phone must be at least 10 characters'),
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters'),
  zip_code: z
    .string()
    .min(1, 'Zip code is required')
    .min(3, 'Zip code must be at least 3 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
