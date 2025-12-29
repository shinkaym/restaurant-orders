import { axiosInstance, tokenManager } from './axiosInstance';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<string> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    const token = response.data.token;
    tokenManager.setToken(token);
    return 'Login successfully';
  },
};
