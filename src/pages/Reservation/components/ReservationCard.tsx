import React from 'react';
import type { ReservationItem } from '../../../types';
import ItemCard from '../../../components/common/ItemCard';

interface ReservationCardProps {
  reservation: ReservationItem;
  onPrint: (reservation: ReservationItem) => void;
  onViewDetails?: (reservation: ReservationItem) => void;
  onConfirmComplete?: (id: string) => void;
  onConfirmDelete?: (id: string) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onPrint,
  onViewDetails,
  onConfirmComplete,
  onConfirmDelete,
}) => {
  const guestInfo = (
    <span className="guest-badge">
      <i className="fas fa-users"></i> {reservation.number_of_people}{' '}
      {reservation.number_of_people === 1 ? 'guest' : 'guests'}
    </span>
  );

  return (
    <ItemCard
      item={{
        id: reservation.rid,
        status: reservation.status as string,
        customer_name: reservation.customer_name,
        order: reservation.order,
        notes: reservation.notes,
        expense: reservation.expense,
        time: reservation.reservation_time,
        extraInfo: guestInfo,
      }}
      onPrint={() => onPrint(reservation)}
      onViewDetails={onViewDetails ? () => onViewDetails(reservation) : undefined}
      onConfirmComplete={onConfirmComplete}
      onConfirmDelete={onConfirmDelete}
      printTitle="Print reservation"
      completeTitle="Check in"
    />
  );
};

export default ReservationCard;
