import React from 'react';
import PrintOrderHeader from './PrintOrderHeader';
import type { OrderItem } from '../../../types';

interface PrintOrderContentProps {
  order: OrderItem;
}

const PrintOrderContent: React.FC<PrintOrderContentProps> = ({ order }) => {
  // Use actual order items from the order data
  const orderItems = order.order || [];

  // Calculate totals - use expense from order
  const subtotal = order.expense;
  const tax = 0; // Tax already included in expense if needed
  const total = subtotal + tax;

  return (
    <div className="print-order-content">
        <PrintOrderHeader order={order} />

        <div className="section-header">
          <h3 className="section-title">Order Information</h3>
        </div>

        <div className="details-table">
          <div className="tbody">
            <div className="tr">
              <div className="td label">Customer:</div>
              <div className="td value">{order.customer_name}</div>
            </div>
            <div className="tr">
              <div className="td label">Phone:</div>
              <div className="td value">{order.customer_phone}</div>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h3 className="section-title">Items Ordered</h3>
        </div>

        <div className="items-table">
          <div className="thead">
            <div className="tr">
              <div className="th">Item</div>
              <div className="th text-center">Qty</div>
            </div>
          </div>
          <div className="tbody">
            {orderItems.map((item, index) => (
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

        {order.notes && (
          <div className="notes-section">
            <h3 className="section-title">Note</h3>
            <p>{order.notes}</p>
          </div>
        )}
    </div>
  );
};

export default PrintOrderContent;
