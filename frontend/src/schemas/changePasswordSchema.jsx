import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),

    c_password: z
      .string()
      .min(1, 'Please confirm your password')
      .min(6, 'Password must be at least 6 characters'),
    new_password: z
      .string()
      .min(1, 'Please enter your new password')
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.new_password === data.c_password, {
    message: 'Passwords do not match',
    path: ['c_password'],
  });
