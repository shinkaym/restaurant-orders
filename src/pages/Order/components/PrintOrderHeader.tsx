import React from 'react';
import type { OrderItem } from '../../../types';

interface PrintOrderHeaderProps {
  order: OrderItem;
}

const PrintOrderHeader: React.FC<PrintOrderHeaderProps> = ({ order }) => {
  return (
    <div className="bill-header">
      <div className="restaurant-info">
        <h1>PRISTINE DINING</h1>
      </div>
      <div className="bill-meta">
        <h2>Order #{order.oid}</h2>
        <p>Date: {order.created_at}</p>
      </div>
    </div>
  );
};

export default PrintOrderHeader;
