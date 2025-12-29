import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_RESERVATIONS } from '../../data/mockData';
import type { ReservationItem } from '../../types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

// Query keys factory
export const reservationKeys = {
  all: ['reservations'] as const,
  byDate: (date: string) => [...reservationKeys.all, 'byDate', date] as const,
};

/**
 * Hook to fetch reservations by date (using mock data)
 */
export const useReservationsByDate = (date: string) => {
  return useQuery({
    queryKey: reservationKeys.byDate(date),
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter mock data by selected date
      const filteredReservations = MOCK_RESERVATIONS.filter((reservation) =>
        reservation.created_at.includes(date)
      );

      return filteredReservations;
    },
  });
};

/**
 * In-memory store for mock reservations (simulates server state)
 */
let mockReservationsStore: ReservationItem[] = [...MOCK_RESERVATIONS];

/**
 * Hook to complete a reservation (check-in) with optimistic update
 */
export const useCompleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rid: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update in-memory store
      mockReservationsStore = mockReservationsStore.map((reservation) =>
        reservation.rid === rid ? { ...reservation, status: 'Done' } : reservation
      );

      return `Reservation ${rid} checked in successfully`;
    },
    onMutate: async (rid: string) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: reservationKeys.all });

      // Optimistically update all reservation caches
      queryClient.setQueriesData(
        { queryKey: reservationKeys.all },
        (oldData: ReservationItem[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((reservation) =>
            reservation.rid === rid ? { ...reservation, status: 'Done' } : reservation
          );
        }
      );
    },
    onSuccess: (_data, variables) => {
      showSuccessToast(`Reservation ${variables} checked in!`);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete reservation';
      showErrorToast(errorMessage);
      // Refetch on error to sync with server
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};

/**
 * Hook to delete a reservation with optimistic update
 */
export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rid: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove from in-memory store
      mockReservationsStore = mockReservationsStore.filter((reservation) => reservation.rid !== rid);

      return `Reservation ${rid} deleted successfully`;
    },
    onMutate: async (rid: string) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: reservationKeys.all });

      // Optimistically update all reservation caches
      queryClient.setQueriesData(
        { queryKey: reservationKeys.all },
        (oldData: ReservationItem[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((reservation) => reservation.rid !== rid);
        }
      );
    },
    onSuccess: (_data, variables) => {
      showSuccessToast(`Reservation ${variables} deleted!`);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete reservation';
      showErrorToast(errorMessage);
      // Refetch on error to sync with server
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};
