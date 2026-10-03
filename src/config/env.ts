import { z } from 'zod'

const apiBaseUrlSchema = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith('/') || z.string().url().safeParse(value).success,
    'Must be an absolute URL (https://...) or same-origin path (/api/app/v1)',
  )

/**
 * Centralised, validated access to environment variables.
 * Fails fast at module load if a required variable is missing or malformed.
 */
const envSchema = z.object({
  /**
   * Browser-facing API base URL.
   * Use `/api/app/v1` (recommended) to route through the Next.js proxy and avoid CORS.
   * Use a full URL only when the backend already allows your frontend origin.
   */
  NEXT_PUBLIC_API_BASE_URL: apiBaseUrlSchema,
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('SDMS'),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().int().positive().default(30000),
  NEXT_PUBLIC_ENABLE_MOCK_AUTH: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
  NEXT_PUBLIC_ENABLE_MOCK_AUTH: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH,
})

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${parsed.error.errors
      .map((e) => `  - ${e.path.join('.')}: ${e.message}`)
      .join('\n')}`,
  )
}

export const env = parsed.data

/** True when API calls go through the same-origin Next.js proxy (`/api/app/v1`). */
export function isProxiedApiBaseUrl(baseUrl: string = env.NEXT_PUBLIC_API_BASE_URL): boolean {
  return baseUrl.startsWith('/')
}
