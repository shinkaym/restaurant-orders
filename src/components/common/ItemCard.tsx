import React from 'react';
import clsx from 'clsx';

export interface ItemCardData {
  id: string;
  status: string;
  customer_name: string;
  order: Array<{ item: string; quantity: number }>;
  notes?: string;
  expense: number;
  time: string;
  extraInfo?: React.ReactNode;
}

interface ItemCardProps<T extends ItemCardData> {
  item: T;
  onPrint: (item: T) => void;
  onViewDetails?: (item: T) => void;
  onConfirmComplete?: (id: string) => void;
  onConfirmDelete?: (id: string) => void;
  printTitle?: string;
  completeTitle?: string;
}

const ItemCard = React.forwardRef<HTMLDivElement, ItemCardProps<ItemCardData>>(
  (
    {
      item,
      onPrint,
      onViewDetails = () => {},
      onConfirmComplete = () => {},
      onConfirmDelete = () => {},
      printTitle = 'Print',
      completeTitle = 'Mark as done',
    },
    ref
  ) => {
    const MAX_DISPLAY_ITEMS = 3;
    const hasMoreItems = item.order && item.order.length > MAX_DISPLAY_ITEMS;
    const displayedItems = item.order ? item.order.slice(0, MAX_DISPLAY_ITEMS) : [];

    return (
      <>
      <div
        ref={ref}
        className={clsx('order-card', { completed: item.status === 'Done' })}
      >
        <div className="card-header">
          <span className="order-id">{item.id}</span>
          {item.status === 'Done' ? (
            <span className="status-badge">
              <i className="fas fa-check-circle"></i> Done
            </span>
          ) : (
            <span className="order-time">
              <i className="fas fa-clock"></i> {item.time}
            </span>
          )}
        </div>
        <div className="card-body" onClick={() => onViewDetails(item)} style={{ cursor: 'pointer' }}>
          <div className="customer-header">
            <h3 className="customer-name">{item.customer_name}</h3>
            {item.extraInfo && <div className="order-info">{item.extraInfo}</div>}
          </div>
          <div className="order-items">
            {item.order && item.order.length > 0 ? (
              <div className="bill-items">
                {displayedItems.map((orderItem, index) => (
                  <div key={index} className="bill-item">
                    <span className="item-name">{orderItem.item}</span>
                    <span className="item-dots"></span>
                    <span className="item-qty">x{orderItem.quantity}</span>
                  </div>
                ))}
                {hasMoreItems && (
                  <div className="bill-item-more">
                    <span className="more-indicator">... +{item.order.length - MAX_DISPLAY_ITEMS} more</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-items">No items</p>
            )}
          </div>

          <div className="card-note-section">
            <label>Note:</label>
            <div className="note-display">{item.notes || 'No notes'}</div>
          </div>
          <div className="card-footer">
            <span className="order-price">${item.expense}</span>
          </div>
        </div>

        {item.status === 'New' && (
          <div className="card-actions">
            <button
              className="action-btn print-btn"
              onClick={() => onPrint(item)}
              title={printTitle}
            >
              <i className="fas fa-print"></i>
            </button>
            <button
              className="action-btn done-btn"
              onClick={() => onConfirmComplete(item.id)}
              title={completeTitle}
            >
              <i className="fas fa-check"></i>
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => onConfirmDelete(item.id)}
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        )}
      </div>
      </>
    );
  }
);

ItemCard.displayName = 'ItemCard';

export default ItemCard;
