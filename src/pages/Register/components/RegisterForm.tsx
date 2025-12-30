import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../components/common/FormInput';
import Button from '../../../components/common/Button';
import { useAuthStore } from '../../../store/auth.store';
import { registerSchema, type RegisterFormData } from '../../../schemas/auth.schema';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);
    try {
      // Convert form data to API format (zip_code -> zipcode)
      await registerUser({
        username: data.username,
        password: data.password,
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state,
        zipcode: data.zip_code || '',
      });

      // Navigate to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch {
      // Error already handled by store with toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      <div className="form-row">
        <FormInput
          label="Username"
          type="text"
          placeholder="Choose a username"
          error={errors.username?.message}
          icon="user"
          isRequired
          disabled={isLoading}
          {...register('username')}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Create password"
          error={errors.password?.message}
          icon="lock"
          isRequired
          disabled={isLoading}
          {...register('password')}
        />
      </div>

      <div className="form-row full-width">
        <FormInput
          label="Email"
          type="email"
          placeholder="Your email address"
          error={errors.email?.message}
          icon="envelope"
          disabled={isLoading}
          {...register('email')}
        />
      </div>

      <div className="form-row">
        <FormInput
          label="Full Name"
          type="text"
          placeholder="Your full name"
          error={errors.name?.message}
          icon="id-card"
          disabled={isLoading}
          {...register('name')}
        />

        <FormInput
          label="Phone"
          type="tel"
          placeholder="Your phone number"
          error={errors.phone?.message}
          icon="phone"
          disabled={isLoading}
          {...register('phone')}
        />
      </div>

      <div className="form-row">
        <FormInput
          label="Address"
          type="text"
          placeholder="Street address"
          error={errors.address?.message}
          icon="home"
          disabled={isLoading}
          {...register('address')}
        />

        <FormInput
          label="City"
          type="text"
          placeholder="Your city"
          error={errors.city?.message}
          icon="building"
          disabled={isLoading}
          {...register('city')}
        />
      </div>

      <div className="form-row">
        <FormInput
          label="State"
          type="text"
          placeholder="State/Province"
          error={errors.state?.message}
          icon="map"
          isRequired
          disabled={isLoading}
          {...register('state')}
        />

        <FormInput
          label="Zip Code"
          type="text"
          placeholder="Postal code"
          error={errors.zip_code?.message}
          icon="envelope"
          disabled={isLoading}
          {...register('zip_code')}
        />
      </div>

      <Button
        type="submit"
        className="register-button"
        icon={isLoading ? 'spinner' : 'arrow-right'}
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
