import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintOrderContent from './PrintOrderContent';
import type { OrderItem } from '../../../types';

interface PrintOrderModalProps {
  isOpen: boolean;
  order: OrderItem | null;
  onClose: () => void;
}

const PrintOrderModal: React.FC<PrintOrderModalProps> = ({ isOpen, order, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Order-${order?.oid || 'Details'}`,
  });

  if (!isOpen || !order) return null;

  return (
    <div className='print-modal-overlay'>
      <div className='print-modal'>
        <div className='print-modal-header'>
          <h2>
            <i className='fas fa-receipt'></i>
            Order Details
          </h2>
          <button className='print-modal-close' onClick={onClose}>
            <i className='fas fa-times'></i>
          </button>
        </div>
        <div className='print-modal-body'>
          <div className='modal-print-content' ref={printRef}>
            <PrintOrderContent order={order} />
          </div>
        </div>
        <div className='print-modal-footer'>
          <button className='print-modal-btn print-modal-btn-secondary' onClick={onClose}>
            <i className='fas fa-times'></i>
            Close
          </button>
          <button className='print-modal-btn print-modal-btn-primary' onClick={handlePrint}>
            <i className='fas fa-print'></i>
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintOrderModal;
