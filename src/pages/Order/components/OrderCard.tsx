import React from 'react';
import type { OrderItem } from '../../../types';
import ItemCard from '../../../components/common/ItemCard';

interface OrderCardProps {
  order: OrderItem;
  onPrint: (order: OrderItem) => void;
  onViewDetails?: (order: OrderItem) => void;
  onConfirmComplete?: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPrint,
  onViewDetails,
  onConfirmComplete,
}) => {
  return (
    <ItemCard
      item={{
        id: order.oid,
        status: order.status as string,
        customer_name: order.customer_name,
        order: order.order,
        notes: order.notes,
        expense: order.expense,
        time: order.pickup_time,
      }}
      onPrint={() => onPrint(order)}
      onViewDetails={onViewDetails ? () => onViewDetails(order) : undefined}
      onConfirmComplete={onConfirmComplete}
      printTitle="Print order"
      completeTitle="Mark as done"
    />
  );
};

export default OrderCard;
