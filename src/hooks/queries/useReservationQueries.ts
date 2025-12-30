import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '../../api';
import type { ReservationItem } from '../../types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

// Query keys factory
export const reservationKeys = {
  all: ['reservations'] as const,
  byDate: (date: string) => [...reservationKeys.all, 'byDate', date] as const,
};

/**
 * Hook to fetch reservations by date (using real API)
 */
export const useReservationsByDate = (date: string) => {
  return useQuery({
    queryKey: reservationKeys.byDate(date),
    queryFn: async () => {
      return await reservationApi.getReservationsByDate(date);
    },
  });
};

/**
 * Hook to complete a reservation (check-in) with optimistic update
 */
export const useCompleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rid: string) => {
      return await reservationApi.updateReservationStatus(rid, 'Done');
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
    onError: () => {
      showErrorToast('Failed to check in reservation');
      // Refetch on error to sync with server
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
  });
};


