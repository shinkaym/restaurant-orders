const STORAGE_KEY = 'pristine-dining-remember-token';

export const saveToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY, token);
};

export const loadToken = (): string | null => {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    return token;
  } catch {
    clearToken();
    return null;
  }
};

export const clearToken = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasRememberedToken = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
