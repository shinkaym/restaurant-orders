/**
 * Cookie Manager Utility
 * Handles cookie operations for authentication and session management
 */

/**
 * Set a cookie with automatic expiration
 * @param name Cookie name
 * @param value Cookie value
 * @param days Number of days until expiration (default: 3)
 */
export const setCookie = (name: string, value: string, days: number = 3): void => {
  try {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const path = 'path=/';
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; ${path}`;
  } catch {
    // Silently fail - cookie operations are not critical
  }
};

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(nameEQ)) {
        const value = trimmed.substring(nameEQ.length);
        return decodeURIComponent(value);
      }
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Remove a cookie by name
 * @param name Cookie name
 */
export const removeCookie = (name: string): void => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch {
    // Silently fail - cookie operations are not critical
  }
};

/**
 * Check if a cookie exists and is valid
 * @param name Cookie name
 * @returns True if cookie exists, false otherwise
 */
export const isValidCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

