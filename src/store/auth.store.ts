import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authApi } from '../api';
import type { LoginRequest } from '../types/auth';
import { showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';
import { tokenManager } from '../api/axiosInstance';
import { clearToken } from '../utils/rememberMe';
import { mockLoginApi } from '../data/mockAuth';

interface User {
  username: string;
  token: string;
}

interface AuthStoreState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRestored: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
  setRestored: (restored: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isRestored: false,

    setRestored: (restored: boolean) => {
      set({ isRestored: restored });
    },

    login: async (credentials: LoginRequest) => {
      set({ isLoading: true, error: null });
      const loadingToastId = showLoadingToast('Logging in...');
      try {
        // Call real login API
        // const response = await authApi.login(credentials);
        const response = await mockLoginApi.login(credentials);

        // Token is already saved by authApi.login()
        // Store user info with token
        set({
          user: {
            username: credentials.username,
            token: response.token,
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Show success toast
        updateToastSuccess(loadingToastId, 'Login successful!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed';
        set({
          error: errorMessage,
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
        // Show error toast
        updateToastError(loadingToastId, errorMessage);
      }
    },

    logout: async () => {
      const loadingToastId = showLoadingToast('Logging out...');
      try {
        // Call logout API (will clear token automatically)
        await authApi.logout();

        // Clear saved token from localStorage (remember me)
        clearToken();

        // Clear auth state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });

        updateToastSuccess(loadingToastId, 'Logged out successfully!');
      } catch {
        // Even if logout API fails, still clear local state
        clearToken();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
        updateToastSuccess(loadingToastId, 'Logged out successfully!');
      }
    },

    reset: () => {
      // Clear token from cookie
      tokenManager.removeToken();

      // Clear saved token from localStorage (remember me)
      clearToken();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    },
  }))
);
