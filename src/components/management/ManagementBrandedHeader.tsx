import React from 'react';

interface ManagementBrandedHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
}

const ManagementBrandedHeader: React.FC<ManagementBrandedHeaderProps> = ({ icon, title, subtitle }) => {
  return (
    <div className="branded-header">
      <div className="brand-logo">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="brand-info">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default ManagementBrandedHeader;
