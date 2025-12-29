import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ReservationItem } from '../types/index';

interface ReservationUIState {
  // Modal state
  printModalOpen: boolean;
  printReservation: ReservationItem | null;
  confirmAction: 'complete' | 'delete' | null;
  pendingReservationId: string | null;
  itemDetailsModalOpen: boolean;
  itemDetailsReservation: ReservationItem | null;

  // Filter/Sort state
  showCompleted: boolean;
  selectedDate: string;
  sortBy: 'date' | 'name' | 'time';
  filterStatus: 'all' | 'pending' | 'completed';

  // Actions
  setPrintModal: (open: boolean, reservation?: ReservationItem | null) => void;
  setConfirmAction: (action: 'complete' | 'delete' | null, id?: string | null) => void;
  setItemDetailsModal: (open: boolean, reservation?: ReservationItem | null) => void;
  setShowCompleted: (show: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSortBy: (sort: 'date' | 'name' | 'time') => void;
  setFilterStatus: (status: 'all' | 'pending' | 'completed') => void;
  reset: () => void;
}

const getInitialDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  return `${month}-${day}-${year}`;
};

export const useReservationStore = create<ReservationUIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        printModalOpen: false,
        printReservation: null,
        confirmAction: null,
        pendingReservationId: null,
        itemDetailsModalOpen: false,
        itemDetailsReservation: null,
        showCompleted: false,
        selectedDate: getInitialDate(),
        sortBy: 'time',
        filterStatus: 'all',

        // Actions
        setPrintModal: (open, reservation = null) =>
          set({ printModalOpen: open, printReservation: reservation }),

        setConfirmAction: (action, id = null) =>
          set({ confirmAction: action, pendingReservationId: id }),

        setItemDetailsModal: (open, reservation = null) =>
          set({ itemDetailsModalOpen: open, itemDetailsReservation: reservation }),

        setShowCompleted: (show) => set({ showCompleted: show }),

        setSelectedDate: (date) => set({ selectedDate: date }),

        setSortBy: (sort) => set({ sortBy: sort }),

        setFilterStatus: (status) => set({ filterStatus: status }),

        reset: () =>
          set({
            printModalOpen: false,
            printReservation: null,
            confirmAction: null,
            pendingReservationId: null,
            itemDetailsModalOpen: false,
            itemDetailsReservation: null,
            showCompleted: false,
            selectedDate: getInitialDate(),
          }),
      }),
      {
        name: 'reservation-store',
        partialize: (state) => ({
          selectedDate: state.selectedDate,
          showCompleted: state.showCompleted,
          sortBy: state.sortBy,
          filterStatus: state.filterStatus,
        }),
      }
    )
  )
);
