import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { setCookie, getCookie, removeCookie, isValidCookie } from '../utils/cookieManager';
import { ENV } from '../config/env';

const TOKEN_STORAGE_KEY = 'auth_token';

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.apiBaseUrl,
  timeout: ENV.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor - Add token to headers (skip for public endpoints)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle HTTP status codes
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response (2xx) - return as-is, let each API parse its own body
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    // Handle 401 Unauthorized - Auto logout
    if (status === 401) {
      tokenManager.removeToken();
      // Dispatch custom event for logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));

      const apiError = new Error('Unauthorized - Please login again');
      return Promise.reject(apiError);
    }

    // Handle other HTTP errors
    const apiError = new Error('Request failed');
    return Promise.reject(apiError);
  }
);

// Token management utilities
export const tokenManager = {
  setToken: (token: string): void => {
    // Set cookie with configurable expiration
    setCookie(TOKEN_STORAGE_KEY, token, ENV.tokenExpiryDays);
  },

  getToken: (): string | null => {
    return getCookie(TOKEN_STORAGE_KEY);
  },

  removeToken: (): void => {
    removeCookie(TOKEN_STORAGE_KEY);
  },

  isTokenValid: (): boolean => {
    return isValidCookie(TOKEN_STORAGE_KEY);
  },
};
