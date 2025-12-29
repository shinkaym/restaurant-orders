import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects to /login if user is not authenticated
 * Waits for token restoration before checking auth status
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const store = useAuth();
  const { isAuthenticated, isLoading, isRestored } = store;

  // Show loading state while token is being restored or checking authentication
  if (!isRestored || isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
