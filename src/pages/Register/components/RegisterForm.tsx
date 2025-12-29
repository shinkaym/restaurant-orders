import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../../components/common/FormInput';
import Button from '../../../components/common/Button';
import { showSuccessToast } from '../../../utils/toast';
import { registerSchema, type RegisterFormData } from '../../../schemas/auth.schema';

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });

  const onSubmit = (): void => {
    // Handle registration
    showSuccessToast('Account created successfully!');
    reset();
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
          {...register('username')}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Create password"
          error={errors.password?.message}
          icon="lock"
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
          {...register('name')}
        />

        <FormInput
          label="Phone"
          type="tel"
          placeholder="Your phone number"
          error={errors.phone?.message}
          icon="phone"
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
          {...register('address')}
        />

        <FormInput
          label="City"
          type="text"
          placeholder="Your city"
          error={errors.city?.message}
          icon="building"
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
          {...register('state')}
        />

        <FormInput
          label="Zip Code"
          type="text"
          placeholder="Postal code"
          error={errors.zip_code?.message}
          icon="envelope"
          {...register('zip_code')}
        />
      </div>

      <Button
        type="submit"
        className="register-button"
        icon="arrow-right"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
