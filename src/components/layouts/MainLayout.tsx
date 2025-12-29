import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  type?: 'auth' | 'management' | 'login' | 'register';
}

export default function MainLayout({ children, type = 'management' }: MainLayoutProps) {
  return (
    <div className={type === 'login' ? 'login-wrapper' : type === 'register' ? 'register-wrapper' : 'page-wrapper'}>
      <div className='page-content'>
        {type === 'login' ? (
          <div className='login-container'>{children}</div>
        ) : type === 'register' ? (
          <div className='register-container'>{children}</div>
        ) : type === 'auth' ? (
          <div className='auth-container'>{children}</div>
        ) : (
          <div className='page-content'>
            <div className='content-container'>{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}
