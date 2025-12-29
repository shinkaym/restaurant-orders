import { useCallback, useMemo } from 'react';
import { useOrdersByDate, useCompleteOrder, useDeleteOrder } from './queries/useOrderQueries';
import { useOrderStore } from '../store/order.store';
import { showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';

/**
 * Combined hook: TanStack Query (data) + Zustand (UI state)
 * - Query: Fetch orders, cache, auto-refresh every 1 minute
 * - Mutations: Complete/Delete with optimistic updates
 * - Zustand: Filter/sort, modal state, temporary state
 */
export const useOrders = () => {
  // Zustand - UI state (filter, sort, modal, temporary state)
  const {
    selectedDate: uiSelectedDate,
    showCompleted,
    sortBy,
    filterStatus,
    printModalOpen,
    printOrder,
    confirmAction,
    pendingOrderId,
    itemDetailsModalOpen,
    itemDetailsOrder,
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
    setShowCompleted,
    setSelectedDate: setUISelectedDate,
  } = useOrderStore();

  // Query for orders by date
  const ordersQuery = useOrdersByDate(uiSelectedDate);
  const completeOrderMutation = useCompleteOrder();
  const deleteOrderMutation = useDeleteOrder();

  // Filter and categorize orders
  const processedOrders = useMemo(() => {
    const allOrders = ordersQuery.data || [];
    let filtered = [...allOrders];

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter((o) => o.status === 'New');
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter((o) => o.status === 'Done');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.customer_name.localeCompare(b.customer_name);
      } else if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return filtered;
  }, [ordersQuery.data, filterStatus, sortBy]);

  const pendingOrders = useMemo(() => processedOrders.filter((o) => o.status === 'New'), [processedOrders]);
  const completedOrders = useMemo(() => processedOrders.filter((o) => o.status === 'Done'), [processedOrders]);

  // Handlers
  const handleCompleteOrder = useCallback(
    (oid: string) => {
      completeOrderMutation.mutate(oid);
      setConfirmAction(null, null);
      setShowCompleted(true); // Auto switch to completed view after completing
    },
    [completeOrderMutation, setConfirmAction, setShowCompleted]
  );

  const handleDeleteOrder = useCallback(
    (oid: string) => {
      deleteOrderMutation.mutate(oid);
      setConfirmAction(null, null);
    },
    [deleteOrderMutation, setConfirmAction]
  );

  const handleDateChange = useCallback(
    (date: string) => {
      const toastId = showLoadingToast('Loading orders...');
      setUISelectedDate(date);

      // Refetch orders for new date
      setTimeout(() => {
        ordersQuery.refetch().then((result) => {
          const count = result.data?.length || 0;
          updateToastSuccess(toastId, `Loaded ${count} orders`);
        });
      }, 100);
    },
    [ordersQuery, setUISelectedDate]
  );

  // Manual refresh with toast
  const loadOrders = useCallback(async () => {
    const toastId = showLoadingToast('Loading orders...');
    try {
      const result = await ordersQuery.refetch();
      const count = result.data?.length || 0;
      updateToastSuccess(toastId, `Loaded ${count} orders`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load orders';
      updateToastError(toastId, errorMsg);
    }
  }, [ordersQuery]);

  // Calculate counts
  const pendingCount = pendingOrders.length;
  const completedCount = completedOrders.length;
  const totalCount = pendingCount + completedCount;

  return {
    // Data from Query
    pendingOrders,
    completedOrders,

    // UI State from Zustand
    selectedDate: uiSelectedDate,
    showCompleted,
    printModalOpen,
    printOrder,
    confirmAction,
    pendingOrderId,
    itemDetailsModalOpen,
    itemDetailsOrder,

    // Counts
    pendingCount,
    completedCount,
    totalCount,

    // Actions
    handleCompleteOrder,
    handleDeleteOrder,
    handleDateChange,
    loadOrders,

    // Zustand actions
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
    setShowCompleted,
  };
};
