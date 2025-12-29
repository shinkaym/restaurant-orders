import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { setCookie, getCookie, removeCookie, isValidCookie } from '../utils/cookieManager';

const API_BASE_URL = 'http://localhost:8081';
const TOKEN_STORAGE_KEY = 'auth_token';

// Create axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Extend Axios config to support skipAuth option
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

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
    // Set cookie with 3-day expiration
    setCookie(TOKEN_STORAGE_KEY, token, 3);
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
