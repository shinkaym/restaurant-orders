/**
 * Remember Me utilities for saving/loading authentication token
 *
 * When "Remember Me" is checked, the token is saved to localStorage
 * for persistent authentication across browser sessions.
 *
 * WARNING: This stores the token in localStorage. In production, use:
 * - Secure HTTP-only cookies
 * - OAuth/SSO with refresh tokens
 * - Server-side session management
 *
 * This is only suitable for demo/development purposes.
 */

const STORAGE_KEY = 'pristine-dining-remember-token';

/**
 * Save authentication token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY, token);
};

/**
 * Load saved token from localStorage
 */
export const loadToken = (): string | null => {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    return token;
  } catch {
    clearToken();
    return null;
  }
};

/**
 * Clear saved token from localStorage
 */
export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Check if token is saved
 */
export const hasRememberedToken = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
