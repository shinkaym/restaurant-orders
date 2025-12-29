import React from 'react';

interface AuthLogoSectionProps {
  icon: string;
  title: string;
  subtitle: string;
}

const AuthLogoSection: React.FC<AuthLogoSectionProps> = ({ icon, title, subtitle }) => {
  return (
    <div className="logo-section">
      <div className="logo-icon">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <h1 className="restaurant-name">{title}</h1>
      <p className="restaurant-tagline">{subtitle}</p>
    </div>
  );
};

export default AuthLogoSection;
