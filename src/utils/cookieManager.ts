import { encryptPassword, decryptPassword } from './encryption';

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

export const removeCookie = (name: string): void => {
  try {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch {
    // Silently fail - cookie operations are not critical
  }
};

export const isValidCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

export const saveCredentials = (username: string, password: string, days: number = 3): void => {
  setCookie('pristine-dining-username', username, days);
  // Encrypt password before storing
  const encryptedPassword = encryptPassword(password);
  setCookie('pristine-dining-password', encryptedPassword, days);
};

export const loadCredentials = (): { username: string; password: string } | null => {
  const username = getCookie('pristine-dining-username');
  const encryptedPassword = getCookie('pristine-dining-password');

  if (username && encryptedPassword) {
    // Decrypt password before returning
    const password = decryptPassword(encryptedPassword);

    // If decryption fails, return null to prevent login with invalid password
    if (!password) {
      return null;
    }

    return { username, password };
  }

  return null;
};

export const clearCredentials = (): void => {
  removeCookie('pristine-dining-username');
  removeCookie('pristine-dining-password');
};

export const hasRememberedCredentials = (): boolean => {
  return isValidCookie('pristine-dining-username') && isValidCookie('pristine-dining-password');
};

