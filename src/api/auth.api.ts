import { axiosInstance, tokenManager } from './axiosInstance';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    const token = response.data.token;
    tokenManager.setToken(token);
    return response.data;
  },

  logout: async (): Promise<void> => {
    tokenManager.removeToken();
  },
};
