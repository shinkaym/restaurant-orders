import { axiosInstance } from './axiosInstance';
import type { ReservationItem } from '../types/index';
import type { ApiResponse } from '../types/auth';

interface ReservationsByDateRequest {
  date: string; // Format: MM-DD-YYYY
}

interface UpdateReservationStatusRequest {
  rid: string;
  status: string;
}

/**
 * Reservation API endpoints
 */
export const reservationApi = {
  /**
   * Get reservations by date
   * POST /api/rest/reservsbydate
   * @param date - Date in MM-DD-YYYY format
   * @returns Promise with array of reservations
   */
  getReservationsByDate: async (date: string): Promise<ReservationItem[]> => {
    const response = await axiosInstance.post<ApiResponse<ReservationItem[]>>(
      '/api/rest/reservsbydate',
      { date } as ReservationsByDateRequest
    );

    // Parse data if it's a string
    let reservations = response.data.data;
    if (typeof reservations === 'string') {
      reservations = JSON.parse(reservations);
    }

    return Array.isArray(reservations) ? reservations : [];
  },

  /**
   * Update reservation status
   * POST /api/rest/updatereservationstatus
   * @param rid - Reservation ID
   * @param status - New status (e.g., 'Done', 'New', 'Cancelled')
   * @returns Promise with success message
   */
  updateReservationStatus: async (rid: string, status: string): Promise<string> => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      '/api/rest/updatereservationstatus',
      { rid, status } as UpdateReservationStatusRequest
    );

    let message = response.data.data;
    if (typeof message === 'string') {
      message = message.replace(/"/g, '').trim();
    }

    return message;
  },
};
