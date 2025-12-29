// Item data in order/reservation
export interface OrderItemData {
  item: string;
  quantity: number;
}

export interface ReservationItemData {
  item: string;
  quantity: number;
}

// API Response Types (Main types used throughout app)
export interface OrderItem {
  oid: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  expense: number;
  notes: string;
  order: OrderItemData[];
  pickup_time: string;
  sid: string;
  status: 'New' | 'Done' | 'Cancelled';
}

export interface ReservationItem {
  rid: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  expense: number;
  notes: string;
  number_of_people: number;
  order: ReservationItemData[];
  reservation_time: string;
  sid: string;
  status: 'New' | 'Done' | 'Cancelled';
}
