import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mockLoginApi } from '../data/mockAuth';
import type { LoginRequest } from '../types/auth';
import { showSuccessToast, showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';
import { tokenManager } from '../api/axiosInstance';
import { clearToken } from '../utils/rememberMe';

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
  logout: () => void;
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
            // Call mock login API (simulates real API)
            const response = await mockLoginApi.login(credentials);

            // Save token to cookie (3-day expiration)
            tokenManager.setToken(response.token);

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

        logout: () => {
          // Clear token from cookie
          tokenManager.removeToken();

          // Clear saved token from localStorage (remember me)
          clearToken();

          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
          showSuccessToast('Logged out successfully!');
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
