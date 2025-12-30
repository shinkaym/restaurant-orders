import { useCallback, useMemo } from 'react';
import { useReservationsByDate, useCompleteReservation } from './queries/useReservationQueries';
import { useReservationStore } from '../store/reservation.store';
import { showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';

export const useReservations = () => {
  const {
    selectedDate: uiSelectedDate,
    showCompleted,
    filterStatus,
    printModalOpen,
    printReservation,
    confirmAction,
    pendingReservationId,
    itemDetailsModalOpen,
    itemDetailsReservation,
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
    setShowCompleted,
    setSelectedDate: setUISelectedDate,
  } = useReservationStore();

  // TanStack Query - Data fetching & caching
  const reservationsQuery = useReservationsByDate(uiSelectedDate);
  const completeReservationMutation = useCompleteReservation();

  // Filter and categorize reservations
  const doneReservations = useMemo(() => {
    const allReservations = reservationsQuery.data || [];
    let filtered = [...allReservations];

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter((r) => r.status === 'New');
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter((r) => r.status === 'Done');
    }

    return filtered;
  }, [reservationsQuery.data, filterStatus]);

  const pendingReservations = useMemo(
    () => doneReservations.filter((r) => r.status === 'New'),
    [doneReservations]
  );
  const completedReservations = useMemo(
    () => doneReservations.filter((r) => r.status === 'Done'),
    [doneReservations]
  );

  // Handlers
  const handleCompleteReservation = useCallback(
    (rid: string) => {
      completeReservationMutation.mutate(rid);
      setConfirmAction(null, null);
      setShowCompleted(true); // Auto switch to completed view after completing
    },
    [completeReservationMutation, setConfirmAction, setShowCompleted]
  );

  const handleDateChange = useCallback(
    (date: string) => {
      const toastId = showLoadingToast('Loading reservations...');
      setUISelectedDate(date);

      // Refetch reservations for new date
      setTimeout(() => {
        reservationsQuery.refetch().then((result) => {
          const count = result.data?.length || 0;
          updateToastSuccess(toastId, `Loaded ${count} reservations`);
        });
      }, 100);
    },
    [reservationsQuery, setUISelectedDate]
  );

  // Manual refresh with toast
  const loadReservations = useCallback(async () => {
    const toastId = showLoadingToast('Loading reservations...');
    try {
      const result = await reservationsQuery.refetch();
      const count = result.data?.length || 0;
      updateToastSuccess(toastId, `Loaded ${count} reservations`);
    } catch {
      updateToastError(toastId, 'Failed to load reservations');
    }
  }, [reservationsQuery]);

  // Calculate counts
  const pendingCount = pendingReservations.length;
  const completedCount = completedReservations.length;
  const totalCount = pendingCount + completedCount;

  return {
    // Data from Query
    pendingReservations,
    completedReservations,

    // UI State from Zustand
    selectedDate: uiSelectedDate,
    showCompleted,
    printModalOpen,
    printReservation,
    confirmAction,
    pendingReservationId,
    itemDetailsModalOpen,
    itemDetailsReservation,

    // Counts
    pendingCount,
    completedCount,
    totalCount,

    // Actions
    handleCompleteReservation,
    handleDateChange,
    loadReservations,

    // Zustand actions
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
    setShowCompleted,
  };
};
