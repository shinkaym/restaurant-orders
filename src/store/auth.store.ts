import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authApi } from '../api';
import type { LoginRequest, RegisterRequest } from '../types/auth';
import { showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';
import { tokenManager } from '../api/axiosInstance';
import { saveCredentials, clearCredentials } from '../utils/cookieManager';

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
  rememberMe: boolean;

  // Actions
  login: (credentials: LoginRequest, rememberMe: boolean) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
  setRestored: (restored: boolean) => void;
  setRememberMe: (remember: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isRestored: false,
    rememberMe: false,

    setRestored: (restored: boolean) => {
      set({ isRestored: restored });
    },

    setRememberMe: (remember: boolean) => {
      set({ rememberMe: remember });
    },

    login: async (credentials: LoginRequest, rememberMe: boolean) => {
      set({ isLoading: true, error: null });
      const loadingToastId = showLoadingToast('Logging in...');
      try {
        // Call real login API
        const response = await authApi.login(credentials);
        // const response = await mockLoginApi.login(credentials);

        // Token is already saved by authApi.login()
        // Store user info with token and remember me state
        set({
          user: {
            username: credentials.username,
            token: response.token,
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
          rememberMe,
        });

        // Save or clear credentials based on rememberMe checkbox
        if (rememberMe) {
          saveCredentials(credentials.username, credentials.password);
        } else {
          clearCredentials();
        }

        // Show success toast
        updateToastSuccess(loadingToastId, 'Login successful!');
      } catch {
        set({
          error: 'Login failed',
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
        // Show error toast
        updateToastError(loadingToastId, 'Login failed');
      }
    },

    register: async (userData: RegisterRequest) => {
      set({ isLoading: true, error: null });
      const loadingToastId = showLoadingToast('Creating account...');
      try {
        // Call register API
        await authApi.register(userData);

        // Clear loading state
        set({
          isLoading: false,
          error: null,
        });

        // Show success toast
        updateToastSuccess(loadingToastId, 'Registration successful!');
      } catch {
        set({
          error: 'Registration failed',
          isLoading: false,
        });
        // Show error toast
        updateToastError(loadingToastId, 'Registration failed');
        throw new Error('Registration failed'); // Re-throw to let form handle it
      }
    },

    logout: async () => {
      const loadingToastId = showLoadingToast('Logging out...');
      const currentRememberMe = useAuthStore.getState().rememberMe;

      try {
        // Call logout API (will clear token cookie automatically)
        await authApi.logout();

        // Clear credentials only if remember me was NOT checked
        if (!currentRememberMe) {
          clearCredentials();
        }

        // Clear auth state
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          rememberMe: false,
        });

        updateToastSuccess(loadingToastId, 'Logged out successfully!');
      } catch {
        // Even if logout API fails, still clear local state
        // Clear credentials only if remember me was NOT checked
        if (!currentRememberMe) {
          clearCredentials();
        }

        set({
          user: null,
          isAuthenticated: false,
          error: null,
          rememberMe: false,
        });
        updateToastSuccess(loadingToastId, 'Logged out successfully!');
      }
    },

    reset: () => {
      // Clear token from cookie
      tokenManager.removeToken();

      // Clear credentials
      clearCredentials();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        rememberMe: false,
      });
    },
  }))
);
