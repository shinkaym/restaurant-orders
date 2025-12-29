import React from 'react';
import PrintReservationHeader from './PrintReservationHeader';
import type { ReservationItem } from '../../../types';

interface PrintReservationContentProps {
  reservation: ReservationItem;
}

const PrintReservationContent: React.FC<PrintReservationContentProps> = ({ reservation }) => {
  // Use actual reservation items from the order data
  const reservationItems = reservation.order || [];

  // Calculate totals - use expense from reservation
  const subtotal = reservation.expense;
  const tax = 0; // Tax already included in expense if needed
  const total = subtotal + tax;

  return (
    <div className="print-reservation-content">
      <PrintReservationHeader reservation={reservation} />

      <div className="section-header">
        <h3 className="section-title">Reservation Information</h3>
      </div>

      <div className="details-table">
        <div className="tbody">
          <div className="tr">
            <div className="td label">Guest:</div>
            <div className="td value">{reservation.customer_name}</div>
          </div>
          <div className="tr">
            <div className="td label">Number of Guests:</div>
            <div className="td value">{reservation.number_of_people}</div>
          </div>
          <div className="tr">
            <div className="td label">Phone:</div>
            <div className="td value">{reservation.customer_phone}</div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h3 className="section-title">Menu Items</h3>
      </div>

      <div className="items-table">
        <div className="thead">
          <div className="tr">
            <div className="th">Item</div>
            <div className="th text-center">Qty</div>
          </div>
        </div>
        <div className="tbody">
          {reservationItems.map((item, index) => (
            <div className="tr" key={index}>
              <div className="td item-name">{item.item}</div>
              <div className="td text-center">{item.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="totals-section">
        <div className="totals-table">
          <div className="tbody">
            <div className="tr">
              <div className="td label">Subtotal</div>
              <div className="td amount">${subtotal.toFixed(2)}</div>
            </div>
            <div className="tr">
              <div className="td label">Tip</div>
              <div className="td amount">${tax.toFixed(2)}</div>
            </div>
            <div className="tr grand-total">
              <div className="td label">TOTAL</div>
              <div className="td amount">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {reservation.notes && (
        <div className="notes-section">
          <h3 className="section-title">Note</h3>
          <p>{reservation.notes}</p>
        </div>
      )}
    </div>
  );
};

export default PrintReservationContent;
