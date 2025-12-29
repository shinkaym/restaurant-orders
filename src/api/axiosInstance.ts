import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiResponse } from '../types/auth';
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

// Request interceptor - Add token to headers
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

// Response interceptor - Handle custom response format
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if response has the custom API format
    if (response.data && typeof response.data === 'object') {
      const apiResponse = response.data as ApiResponse<unknown>;

      // Check if status indicates an error
      if (apiResponse.status !== 'Success') {
        const error: ApiError = new Error(apiResponse.msg || 'API Error');
        error.status = apiResponse.status;
        error.msg = apiResponse.msg;
        error.originalData = apiResponse.data;
        return Promise.reject(error);
      }

      // Parse data if it's a JSON string
      if (typeof apiResponse.data === 'string') {
        try {
          // Try to parse as JSON
          apiResponse.data = JSON.parse(apiResponse.data);
        } catch {
          // If parsing fails, keep as is
        }
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle network errors
    const apiError: ApiError = new Error(
      error.message || 'Network Error'
    );
    apiError.status = error.response?.status?.toString();
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
