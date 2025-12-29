import { axiosInstance } from './axiosInstance';
import type { ReservationItem } from '../types/index';
import type { ApiResponse } from '../types/auth';

export const reservationApi = {
  getReservationsByDate: async (date: string): Promise<ReservationItem[]> => {
    const response = await axiosInstance.post<ApiResponse<ReservationItem[]>>('/api/rest/reservsbydate', {
      date,
    });

    // Parse data if it's a string
    let reservations = response.data.data;
    if (typeof reservations === 'string') {
      reservations = JSON.parse(reservations);
    }

    return Array.isArray(reservations) ? reservations : [];
  },

  updateReservationStatus: async (rid: string, status: string): Promise<string> => {
    await axiosInstance.post('/api/rest/updatereservationstatus', { rid, status });

    return 'Done updated successfully';
  },
};
