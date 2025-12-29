import React from 'react';
import OrderCard from './OrderCard';
import type { OrderItem } from '../../../types';

interface PendingOrdersSectionProps {
  orders: OrderItem[];
  cardsGridStyle: React.CSSProperties;
  pendingCount: number;
  onPrint: (order: OrderItem) => void;
  onViewDetails: (order: OrderItem) => void;
  onConfirmComplete: (id: string) => void;
}

const PendingOrdersSection: React.FC<PendingOrdersSectionProps> = ({
  orders,
  cardsGridStyle,
  pendingCount,
  onPrint,
  onViewDetails,
  onConfirmComplete,
}) => {
  return (
    <div className="orders-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-hourglass-half"></i> Pending Orders
        </h2>
        <span className="badge-count">{pendingCount}</span>
      </div>
      <div className="cards-grid" style={cardsGridStyle}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.oid}
              order={order}
              onPrint={onPrint}
              onViewDetails={onViewDetails}
              onConfirmComplete={onConfirmComplete}
            />
          ))
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No pending orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingOrdersSection;
