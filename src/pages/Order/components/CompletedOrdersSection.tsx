import React from 'react';
import OrderCard from './OrderCard';
import type { OrderItem } from '../../../types';

interface CompletedOrdersSectionProps {
  orders: OrderItem[];
  cardsGridStyle: React.CSSProperties;
  completedCount: number;
  onViewDetails: (order: OrderItem) => void;
}

const CompletedOrdersSection: React.FC<CompletedOrdersSectionProps> = ({
  orders,
  cardsGridStyle,
  completedCount,
  onViewDetails,
}) => {
  return (
    <div className="orders-section">
      <div className="section-header">
        <h2>
          <i className="fas fa-check-circle"></i> Done Orders
        </h2>
        <span className="badge-count completed-badge">{completedCount}</span>
      </div>
      <div className="cards-grid" style={cardsGridStyle}>
        {orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.oid} order={order} onPrint={() => {}} onViewDetails={onViewDetails} />)
        ) : (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No done orders</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrdersSection;
