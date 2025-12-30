import React from 'react';
import type { ReservationItem } from '../../../types';

interface PrintReservationHeaderProps {
  reservation: ReservationItem;
}

const PrintReservationHeader: React.FC<PrintReservationHeaderProps> = ({ reservation }) => {
  return (
    <div className="bill-header">
      <div className="restaurant-info">
        <h1>PRISTINE DINING</h1>
      </div>
      <div className="bill-meta">
        <h2>Reservation #{reservation.rid}</h2>
        <p>Date: {reservation.created_at}</p>
      </div>
    </div>
  );
};

export default PrintReservationHeader;
