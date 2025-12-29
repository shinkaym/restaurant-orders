import { axiosInstance } from './axiosInstance';
import type { OrderItem } from '../types/index';
import type { ApiResponse } from '../types/auth';

interface OrdersByDateRequest {
  date: string; // Format: MM-DD-YYYY
}

interface UpdateOrderStatusRequest {
  oid: string;
  status: string;
}

/**
 * Order API endpoints
 */
export const orderApi = {
  /**
   * Get orders by date
   * POST /api/rest/ordersbydate
   * @param date - Date in MM-DD-YYYY format
   * @returns Promise with array of orders
   */
  getOrdersByDate: async (date: string): Promise<OrderItem[]> => {
    const response = await axiosInstance.post<ApiResponse<OrderItem[]>>(
      '/api/rest/ordersbydate',
      { date } as OrdersByDateRequest
    );

    // Parse data if it's a string
    let orders = response.data.data;
    if (typeof orders === 'string') {
      orders = JSON.parse(orders);
    }

    return Array.isArray(orders) ? orders : [];
  },

  /**
   * Update order status
   * POST /api/rest/updateorderstatus
   * @param oid - Order ID
   * @param status - New status (e.g., 'Done', 'New', 'Cancelled')
   * @returns Promise with success message
   */
  updateOrderStatus: async (oid: string, status: string): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      '/api/rest/updateorderstatus',
      { oid, status } as UpdateOrderStatusRequest
    );

    let message = response.data.data;
    if (typeof message === 'string') {
      message = message.replace(/"/g, '').trim();
    }

    return message;
  },
};
