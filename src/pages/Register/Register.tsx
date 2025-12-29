import { usePageTitle } from '../../hooks/usePageTitle';
import MainLayout from '../../components/layouts/MainLayout';
import NavPopup from '../../components/common/NavPopup';
import AuthLogoSection from '../../components/auth/AuthLogoSection';
import RegisterForm from './components/RegisterForm';
import RegisterFooter from './components/RegisterFooter';

const Register: React.FC = () => {
  usePageTitle('Register | PRISTINE DINING');

  return (
    <>
      <MainLayout type="register">
        <AuthLogoSection
          icon="user-check"
          title="PRISTINE DINING"
          subtitle="Create Your Account"
        />
        <RegisterForm />
        <RegisterFooter />
      </MainLayout>

      <NavPopup currentPath="/register" />
    </>
  );
};

export default Register;
