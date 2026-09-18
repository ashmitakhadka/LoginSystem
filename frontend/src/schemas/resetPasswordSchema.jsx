import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    c_password: z
      .string()
      .min(1, 'Please confirm your password')
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.c_password, {
    message: 'Passwords do not match',
    path: ['c_password'],
  });
