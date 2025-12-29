import { usePageTitle } from '../../hooks/usePageTitle';
import MainLayout from '../../components/layouts/MainLayout';
import NavPopup from '../../components/common/NavPopup';
import AuthLogoSection from '../../components/auth/AuthLogoSection';
import LoginForm from './components/LoginForm';
import LoginFooter from './components/LoginFooter';

const Login: React.FC = () => {
  usePageTitle('Login | PRISTINE DINING');

  return (
    <>
      <MainLayout type="login">
        <AuthLogoSection
          icon="utensils"
          title="PRISTINE DINING"
          subtitle="Management System"
        />
        <LoginForm />
        <LoginFooter />
      </MainLayout>

      <NavPopup currentPath="/login" />
    </>
  );
};

export default Login;
