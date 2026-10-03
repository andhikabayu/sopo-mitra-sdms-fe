import { z } from 'zod'

/**
 * Login validation schema. Single source of truth for both runtime
 * validation (Zod) and the inferred form value type.
 * `username` accepts a username or an email (backend decides).
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>
