import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_ORDERS } from '../../data/mockData';
import type { OrderItem } from '../../types';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

// Query keys factory
export const orderKeys = {
  all: ['orders'] as const,
  byDate: (date: string) => [...orderKeys.all, 'byDate', date] as const,
};

/**
 * Hook to fetch orders by date (using mock data)
 */
export const useOrdersByDate = (date: string) => {
  return useQuery({
    queryKey: orderKeys.byDate(date),
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter mock data by selected date
      const filteredOrders = MOCK_ORDERS.filter((order) => order.created_at.includes(date));

      return filteredOrders;
    },
  });
};

/**
 * In-memory store for mock orders (simulates server state)
 */
let mockOrdersStore: OrderItem[] = [...MOCK_ORDERS];

/**
 * Hook to complete an order (with optimistic update)
 */
export const useCompleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (oid: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update in-memory store
      mockOrdersStore = mockOrdersStore.map((order) =>
        order.oid === oid ? { ...order, status: 'Done' } : order
      );

      return `Order ${oid} completed successfully`;
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
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete order';
      showErrorToast(errorMessage);
      // Refetch on error to sync with server
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

/**
 * Hook to delete an order (with optimistic update)
 */
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (oid: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove from in-memory store
      mockOrdersStore = mockOrdersStore.filter((order) => order.oid !== oid);

      return `Order ${oid} deleted successfully`;
    },
    onMutate: async (oid: string) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      // Optimistically update all order caches
      queryClient.setQueriesData(
        { queryKey: orderKeys.all },
        (oldData: OrderItem[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.filter((order) => order.oid !== oid);
        }
      );
    },
    onSuccess: (_data, variables) => {
      showSuccessToast(`Order ${variables} deleted!`);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete order';
      showErrorToast(errorMessage);
      // Refetch on error to sync with server
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
