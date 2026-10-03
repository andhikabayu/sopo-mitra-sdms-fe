import { AxiosError, type AxiosResponse } from 'axios'
import type { BackendLoginResponse, LoginCredentials } from '../types/auth.types'

/**
 * DEVELOPMENT-ONLY mock of the auth API.
 * Activated via NEXT_PUBLIC_ENABLE_MOCK_AUTH=true so the UI flow
 * (login -> dashboard -> logout) can be exercised without a backend.
 * Shape mirrors API_DOCS.md (form login -> { code, name, access_token, refresh_token }).
 */

export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
}

/**
 * A fake JWT whose payload encodes role/username so decodeJwt can populate
 * the user (header.payload.signature, base64url, unsigned — dev only).
 */
function fakeJwt(payload: Record<string, unknown>): string {
  const b64 = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'none', typ: 'JWT' })}.${b64(payload)}.mocksignature`
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAuthApi = {
  async login(credentials: LoginCredentials): Promise<BackendLoginResponse['data']> {
    await delay(400) // simulate network latency
    const valid =
      credentials.username === MOCK_CREDENTIALS.username &&
      credentials.password === MOCK_CREDENTIALS.password

    if (!valid) {
      // Mimic the FastAPI 400 error shape ({ detail }) with a real AxiosError.
      const response = {
        status: 400,
        statusText: 'Bad Request',
        data: { detail: 'Incorrect email or password' },
        headers: {},
        config: {},
      } as unknown as AxiosResponse
      throw new AxiosError(
        'Incorrect email or password',
        AxiosError.ERR_BAD_REQUEST,
        undefined,
        undefined,
        response,
      )
    }

    return {
      id: 1,
      name: 'Administrator',
      role: 'Super Admin',
      access_token: fakeJwt({
        sub: 'admin',
        username: 'admin',
        role: 'Super Admin',
        id: 1,
        email: 'admin@sdms.test',
      }),
      refresh_token: fakeJwt({ sub: 'admin', type: 'refresh' }),
    }
  },

  async getUserProfile(id: number) {
    await delay(100)
    return {
      id,
      name: 'Administrator',
      username: 'admin',
      email: 'admin@sdms.test',
      role: 'Super Admin',
    }
  },
}
