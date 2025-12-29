import React from 'react';
import ReservationCard from './ReservationCard';
import type { ReservationItem } from '../../../types';

interface CompletedReservationsSectionProps {
  reservations: ReservationItem[];
  cardsGridStyle: React.CSSProperties;
  completedCount: number;
}

const CompletedReservationsSection: React.FC<CompletedReservationsSectionProps> = ({
  reservations,
  cardsGridStyle,
  completedCount,
}) => {
  return (
    <div className="reservations-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-check-circle"></i> Done Reservations
        </h2>
        <span className="badge-count completed-badge">{completedCount}</span>
      </div>
      <div className="cards-grid" style={cardsGridStyle}>
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <ReservationCard key={res.rid} reservation={res} onPrint={() => {}} />
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No done reservations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedReservationsSection;
