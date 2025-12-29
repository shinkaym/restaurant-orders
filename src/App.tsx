import { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useAuthStore } from './store/auth.store';
import { getCookie } from './utils/cookieManager';
import { showErrorToast } from './utils/toast';
import { loadToken, clearToken } from './utils/rememberMe';
import { tokenManager } from './api/axiosInstance';

function App() {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setRestored = useAuthStore((state) => state.setRestored);
  const expirationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  /**
   * Initialize authentication on app load
   * Restore user if token exists in cookie or localStorage (remember me)
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const cookieToken = getCookie('auth_token');
    const savedToken = loadToken();

    // If we have a saved token from "remember me", restore it to cookie
    if (savedToken && !cookieToken) {
      tokenManager.setToken(savedToken);
      useAuthStore.setState({
        isAuthenticated: true,
        isRestored: true,
      });
      return;
    }

    // If token exists in cookie but user is not authenticated in store, restore from token
    if (cookieToken && !isAuthenticated) {
      useAuthStore.setState({
        isAuthenticated: true,
        isRestored: true,
      });
      return;
    }

    // If no token in cookie or localStorage but user appears authenticated, logout
    if (!cookieToken && !savedToken && isAuthenticated) {
      logout();
      clearToken();
      showErrorToast('Session expired. Please login again.');
    }

    setRestored(true);
  }, [isAuthenticated, logout, setRestored]);

  /**
   * Listen for 401 unauthorized events from axios interceptor
   * Auto-logout when server returns 401
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      showErrorToast('Unauthorized - Please login again');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  /**
   * Setup auto-logout timer when user is authenticated
   * Token expires in 3 days, logout 1 minute before expiration
   */
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timer if user logs out
      if (expirationTimerRef.current) {
        clearTimeout(expirationTimerRef.current);
        expirationTimerRef.current = null;
      }
      return;
    }

    // Token has 3 days expiration
    const TOKEN_LIFETIME_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    const LOGOUT_WARNING_TIME_MS = 60 * 1000; // 1 minute before expiration

    // Clear existing timer
    if (expirationTimerRef.current) {
      clearTimeout(expirationTimerRef.current);
    }

    // Set logout timer: 3 days - 1 minute
    const logoutTime = TOKEN_LIFETIME_MS - LOGOUT_WARNING_TIME_MS;

    expirationTimerRef.current = setTimeout(() => {
      logout();
      showErrorToast('Your session is about to expire. Please login again.');
    }, logoutTime);

    // Cleanup timer on unmount or when user logs out
    return () => {
      if (expirationTimerRef.current) {
        clearTimeout(expirationTimerRef.current);
      }
    };
  }, [isAuthenticated, logout]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}

export default App;
