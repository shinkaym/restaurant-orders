import { axiosInstance } from './axiosInstance';
import type { OrderItem } from '../types/index';
import type { ApiResponse } from '../types/auth';

export const orderApi = {
  getOrdersByDate: async (date: string): Promise<OrderItem[]> => {
    const response = await axiosInstance.post<ApiResponse<OrderItem[]>>('/api/rest/ordersbydate', { date });

    // Parse data if it's a string
    let orders = response.data.data;
    if (typeof orders === 'string') {
      orders = JSON.parse(orders);
    }

    return Array.isArray(orders) ? orders : [];
  },

  updateOrderStatus: async (oid: string, status: string): Promise<string> => {
    await axiosInstance.post('/api/rest/updateorderstatus', { oid, status });

    return 'Done updated successfully';
  },
};
