import React from 'react';
import ReservationCard from './ReservationCard';
import type { ReservationItem } from '../../../types';

interface PendingReservationsSectionProps {
  reservations: ReservationItem[];
  cardsGridStyle: React.CSSProperties;
  pendingCount: number;
  onPrint: (reservation: ReservationItem) => void;
  onViewDetails: (reservation: ReservationItem) => void;
  onConfirmComplete: (id: string) => void;
}

const PendingReservationsSection: React.FC<PendingReservationsSectionProps> = ({
  reservations,
  cardsGridStyle,
  pendingCount,
  onPrint,
  onViewDetails,
  onConfirmComplete,
}) => {
  return (
    <div className="reservations-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-hourglass-half"></i> Pending Reservations
        </h2>
        <span className="badge-count">{pendingCount}</span>
      </div>
      <div className="cards-grid" style={cardsGridStyle}>
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <ReservationCard
              key={res.rid}
              reservation={res}
              onPrint={onPrint}
              onViewDetails={onViewDetails}
              onConfirmComplete={onConfirmComplete}
            />
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No pending reservations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingReservationsSection;
