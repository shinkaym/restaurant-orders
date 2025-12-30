import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../components/common/FormInput';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../hooks/useAuth';
import { loginSchema, type LoginFormData } from '../../../schemas/auth.schema';
import { loadCredentials } from '../../../utils/cookieManager';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading, isAuthenticated } = useAuth();

  // Load saved credentials once on component initialization
  const savedCredentials = useMemo(() => loadCredentials(), []);
  const [rememberMe, setRememberMe] = useState(!!savedCredentials);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      username: savedCredentials?.username || '',
      password: savedCredentials?.password || '',
    },
  });

  // Navigate to dashboard after successful login
  useEffect(() => {
    if (isAuthenticated) {
      // Delay navigation to show success message
      const timer = setTimeout(() => {
        navigate('/order');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(
      {
        username: data.username,
        password: data.password,
      },
      rememberMe
    );
  };

  // Show redirecting message while navigating
  if (isAuthenticated) {
    return <p className="login-redirecting">✓ Redirecting to dashboard...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <FormInput
        label="Username"
        type="text"
        placeholder="Enter your username"
        icon="user"
        disabled={isLoading}
        error={errors.username?.message}
        {...register('username')}
      />

      <FormInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon="lock"
        disabled={isLoading}
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="remember-me-container">
        <label className="remember-me-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            className="remember-me-checkbox"
          />
          <span>Remember me</span>
        </label>
      </div>

      <Button
        type="submit"
        className="login-button"
        icon={isLoading ? 'spinner' : 'arrow-right'}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
