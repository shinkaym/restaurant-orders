import { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useAuthStore } from './store/auth.store';
import { getCookie, hasRememberedCredentials } from './utils/cookieManager';
import { showErrorToast } from './utils/toast';
import { ENV } from './config/env';

function App() {
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const expirationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  /**
   * Initialize authentication on app load
   * Restore user session if token exists in cookie
   *
   * NOTE: This effect MUST only run once on mount to prevent race conditions.
   * Using empty dependency array [] with isInitializedRef guard ensures this.
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const cookieToken = getCookie('auth_token');
    const currentIsAuthenticated = useAuthStore.getState().isAuthenticated;
    const hasCredentials = hasRememberedCredentials();

    // If token exists in cookie but user is not authenticated in store, restore session
    if (cookieToken && !currentIsAuthenticated) {
      useAuthStore.setState({
        isAuthenticated: true,
        isRestored: true,
        rememberMe: hasCredentials, // Restore rememberMe based on saved credentials
      });
      return;
    }

    // If no token but user appears authenticated, logout
    if (!cookieToken && currentIsAuthenticated) {
      useAuthStore.getState().logout();
      showErrorToast('Session expired. Please login again.');
    }

    useAuthStore.getState().setRestored(true);
  }, []);

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

    // Token expiration from env config
    const TOKEN_LIFETIME_MS = ENV.tokenExpiryDays * 24 * 60 * 60 * 1000;
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
