import { useCallback, useMemo } from 'react';
import { useOrdersByDate, useCompleteOrder } from './queries/useOrderQueries';
import { useOrderStore } from '../store/order.store';
import { showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';

export const useOrders = () => {
  const {
    selectedDate: uiSelectedDate,
    showCompleted,
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

  // Categorize orders
  const pendingOrders = useMemo(
    () => (ordersQuery.data || []).filter((o) => o.status === 'New'),
    [ordersQuery.data]
  );
  const completedOrders = useMemo(
    () => (ordersQuery.data || []).filter((o) => o.status === 'Done'),
    [ordersQuery.data]
  );

  // Handlers
  const handleCompleteOrder = useCallback(
    (oid: string) => {
      completeOrderMutation.mutate(oid);
      setConfirmAction(null, null);
      setShowCompleted(true); // Auto switch to completed view after completing
    },
    [completeOrderMutation, setConfirmAction, setShowCompleted]
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
    } catch {
      updateToastError(toastId, 'Failed to load orders');
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
    handleDateChange,
    loadOrders,

    // Zustand actions
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
    setShowCompleted,
  };
};
