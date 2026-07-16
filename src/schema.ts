import { z } from 'zod';

// Fixed bug: added '+' to the character class for the local part, enabling aliases like user+alias@domain.com
export const PAYOUT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const creatorSettingsSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' })
    .regex(/^[a-z0-9_]+$/, { message: 'Username can only contain lowercase letters, numbers, and underscores' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  payoutEmail: z
    .string()
    .min(1, { message: 'Payout email is required' })
    .email({ message: 'Invalid email address' })
    .refine((val) => PAYOUT_EMAIL_REGEX.test(val), {
      message: 'Payout email format is invalid (custom check)',
    }),
  bio: z
    .string()
    .max(100, { message: 'Bio must be under 100 characters' })
    .optional()
    .or(z.literal('')),
  theme: z.enum(['light', 'dark'], {
    errorMap: () => ({ message: 'Please select a valid theme' }),
  }),
  newsletter: z.boolean(),
});

export type CreatorSettings = z.infer<typeof creatorSettingsSchema>;
