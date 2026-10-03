/**
 * Auth cookie names. Kept dependency-free (no js-cookie import) so this
 * module is safe to import from Edge middleware as well as the browser.
 */
export const ACCESS_TOKEN_KEY = 'sdms_access_token'
export const REFRESH_TOKEN_KEY = 'sdms_refresh_token'
export const USER_KEY = 'sdms_user'
