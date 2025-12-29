import React from 'react';
import type { OrderItem } from '../../../types';

interface ItemDetailsModalProps {
  isOpen: boolean;
  item: OrderItem | null;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal item-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-receipt"></i>
            {item.oid}
          </h2>
          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="customer-info">
            <h3>{item.customer_name}</h3>
          </div>

          <div className="modal-items">
            {item.order && item.order.length > 0 ? (
              <div className="bill-items">
                {item.order.map((orderItem, index) => (
                  <div key={index} className="bill-item">
                    <span className="item-name">{orderItem.item}</span>
                    <span className="item-dots"></span>
                    <span className="item-qty">x{orderItem.quantity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-items">No items</p>
            )}
          </div>

          {item.notes && (
            <div className="notes-section">
              <h4>Note</h4>
              <p className="notes-text">{item.notes}</p>
            </div>
          )}

          <div className="summary-section">
            <div className="total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-amount">${item.expense.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
