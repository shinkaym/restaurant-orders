import { axiosInstance, tokenManager } from './axiosInstance';
import type { LoginRequest, LoginResponse, ApiResponse, RegisterRequest, RegisterResponse } from '../types/auth';

/**
 * Login endpoint
 * POST /auth/login
 * @param credentials - Username and password
 * @returns Promise with token
 */
export const authApi = {
  login: async (credentials: LoginRequest): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const token = response.data.data.token;

    // Check if token is an error message (backend returns 200 OK with error in token field)
    if (token && token.includes('FAILED')) {
      throw new Error(token);
    }

    tokenManager.setToken(token);
    return token;
  },

   /**
   * Register endpoint
   * POST /user/register
   * @param userData - User registration data
   * @returns Promise with token
   */
  register: async (userData: RegisterRequest): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<RegisterResponse>>('/user/register', userData);
    const token = response.data.data.token;

    if (token && token.includes('FAILED')) {
      throw new Error(token);
    }

    tokenManager.setToken(token);
    return token;
  },
};
