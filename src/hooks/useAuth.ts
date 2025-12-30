import { useAuthStore } from '../store/auth.store';

/**
 * Hook to use auth store with login/logout functionality
 * Handles authentication state and operations
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isRestored,
    rememberMe,
    login,
    logout,
    setRememberMe,
  } = useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isRestored,
    rememberMe,

    // Actions
    handleLogin: login,
    handleLogout: logout,
    setRememberMe,

    // Direct access to store actions if needed
    login,
    logout,
  };
};
