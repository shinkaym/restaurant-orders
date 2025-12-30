import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../../api';
import type { OrderItem } from '../../types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

// Query keys factory
export const orderKeys = {
  all: ['orders'] as const,
  byDate: (date: string) => [...orderKeys.all, 'byDate', date] as const,
};

/**
 * Hook to fetch orders by date (using real API)
 */
export const useOrdersByDate = (date: string) => {
  return useQuery({
    queryKey: orderKeys.byDate(date),
    queryFn: async () => {
      return await orderApi.getOrdersByDate(date);
    },
  });
};

/**
 * Hook to complete an order (with optimistic update)
 */
export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (oid: string) => {
      return await orderApi.updateOrderStatus(oid, 'Done');
    },
    onMutate: async (oid: string) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      // Optimistically update all order caches
      queryClient.setQueriesData(
        { queryKey: orderKeys.all },
        (oldData: OrderItem[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((order) =>
            order.oid === oid ? { ...order, status: 'Done' } : order
          );
        }
      );
    },
    onSuccess: (_data, variables) => {
      showSuccessToast(`Order ${variables} completed!`);
    },
    onError: () => {
      showErrorToast('Failed to complete order');
      // Refetch on error to sync with server
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};


