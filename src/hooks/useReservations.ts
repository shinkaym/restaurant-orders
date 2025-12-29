import { useCallback, useMemo } from 'react';
import { useReservationsByDate, useCompleteReservation, useDeleteReservation } from './queries/useReservationQueries';
import { useReservationStore } from '../store/reservation.store';
import { showLoadingToast, updateToastSuccess, updateToastError } from '../utils/toast';

/**
 * Combined hook: TanStack Query (data) + Zustand (UI state)
 * - Query: Fetch reservations, cache, auto-refresh every 1 minute
 * - Mutations: Complete/Delete with optimistic updates
 * - Zustand: Filter/sort, modal state, temporary state
 */
export const useReservations = () => {
  // Zustand - UI state (filter, sort, modal, temporary state)
  const {
    selectedDate: uiSelectedDate,
    showCompleted,
    sortBy,
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
  const deleteReservationMutation = useDeleteReservation();

  // Filter and categorize reservations
  const processedReservations = useMemo(() => {
    const allReservations = reservationsQuery.data || [];
    let filtered = [...allReservations];

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter((r) => r.status === 'New');
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter((r) => r.status === 'Done');
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.customer_name.localeCompare(b.customer_name);
      } else if (sortBy === 'time') {
        return a.reservation_time.localeCompare(b.reservation_time);
      } else if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

    return filtered;
  }, [reservationsQuery.data, filterStatus, sortBy]);

  const pendingReservations = useMemo(
    () => processedReservations.filter((r) => r.status === 'New'),
    [processedReservations]
  );
  const completedReservations = useMemo(
    () => processedReservations.filter((r) => r.status === 'Done'),
    [processedReservations]
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

  const handleDeleteReservation = useCallback(
    (rid: string) => {
      deleteReservationMutation.mutate(rid);
      setConfirmAction(null, null);
    },
    [deleteReservationMutation, setConfirmAction]
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
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load reservations';
      updateToastError(toastId, errorMsg);
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
    handleDeleteReservation,
    handleDateChange,
    loadReservations,

    // Zustand actions
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
    setShowCompleted,
  };
};
