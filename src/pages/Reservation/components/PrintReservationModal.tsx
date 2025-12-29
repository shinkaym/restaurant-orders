import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintReservationContent from './PrintReservationContent';
import type { ReservationItem } from '../../../types';
import './PrintReservationModal.css';

interface PrintReservationModalProps {
  isOpen: boolean;
  reservation: ReservationItem | null;
  onClose: () => void;
}

const PrintReservationModal: React.FC<PrintReservationModalProps> = ({
  isOpen,
  reservation,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Reservation-${reservation?.id || 'Details'}`,
  });

  if (!isOpen || !reservation) return null;

  return (
    <div className="print-modal-overlay">
      <div className="print-modal">
        <div className="print-modal-header">
          <h2>
            <i className="fas fa-calendar-check"></i>
            Reservation Details
          </h2>
          <button className="print-modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="print-modal-body">
          <div className="modal-print-content" ref={printRef}>
            <PrintReservationContent reservation={reservation} />
          </div>
        </div>
        <div className="print-modal-footer">
          <button className="print-modal-btn print-modal-btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i>
            Close
          </button>
          <button className="print-modal-btn print-modal-btn-primary" onClick={handlePrint}>
            <i className="fas fa-print"></i>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReservationModal;
