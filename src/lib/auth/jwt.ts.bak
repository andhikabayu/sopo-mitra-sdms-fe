/**
 * Minimal, dependency-free JWT payload decoder (browser).
 * Used to extract optional claims (role, username, id) from the access
 * token, since the backend's login response only returns `name`.
 * Does NOT verify the signature — never trust these claims for security
 * decisions, only for UI hints (e.g. which menu items to show).
 */
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    )
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
