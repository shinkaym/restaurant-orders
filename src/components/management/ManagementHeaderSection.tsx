import React from 'react';

interface ManagementHeaderSectionProps {
  titleIcon: string;
  title: string;
  subtitle: string;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  showCompleted: boolean;
  onToggleView: (showCompleted: boolean) => void;
}

const ManagementHeaderSection: React.FC<ManagementHeaderSectionProps> = ({
  titleIcon,
  title,
  subtitle,
  totalCount,
  pendingCount,
  completedCount,
  showCompleted,
  onToggleView,
}) => {
  return (
    <div className="header-section">
      <div className="title-group">
        <h2>
          <i className={`fas fa-${titleIcon}`}></i> {title}
        </h2>
        <p className="subtitle">{subtitle}</p>
      </div>
      <div className="stats-group">
        <div className="stat-card">
          <span className="stat-number">{totalCount}</span>
          <span className="stat-label">Total</span>
        </div>
        <div
          className={`stat-card pending-stat ${!showCompleted ? 'active' : ''}`}
          onClick={() => onToggleView(false)}
          style={{ cursor: 'pointer' }}
        >
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Pending</span>
          <i
            className={`fas ${!showCompleted ? 'fa-eye' : 'fa-eye-slash'} stat-toggle-icon`}
          ></i>
        </div>
        <div
          className={`stat-card completed-stat ${showCompleted ? 'active' : ''}`}
          onClick={() => onToggleView(true)}
          style={{ cursor: 'pointer' }}
        >
          <span className="stat-number">{completedCount}</span>
          <span className="stat-label">Done</span>
          <i
            className={`fas ${showCompleted ? 'fa-eye' : 'fa-eye-slash'} stat-toggle-icon`}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default ManagementHeaderSection;
