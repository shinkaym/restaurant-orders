import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { OrderItem } from '../types/index';

interface OrderUIState {
  // Modal state
  printModalOpen: boolean;
  printOrder: OrderItem | null;
  confirmAction: 'complete' | 'delete' | null;
  pendingOrderId: string | null;
  itemDetailsModalOpen: boolean;
  itemDetailsOrder: OrderItem | null;

  // Filter/Sort state
  showCompleted: boolean;
  selectedDate: string;
  sortBy: 'date' | 'name' | 'status';
  filterStatus: 'all' | 'pending' | 'completed';

  // Actions
  setPrintModal: (open: boolean, order?: OrderItem | null) => void;
  setConfirmAction: (action: 'complete' | 'delete' | null, id?: string | null) => void;
  setItemDetailsModal: (open: boolean, order?: OrderItem | null) => void;
  setShowCompleted: (show: boolean) => void;
  setSelectedDate: (date: string) => void;
  setSortBy: (sort: 'date' | 'name' | 'status') => void;
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

export const useOrderStore = create<OrderUIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        printModalOpen: false,
        printOrder: null,
        confirmAction: null,
        pendingOrderId: null,
        itemDetailsModalOpen: false,
        itemDetailsOrder: null,
        showCompleted: false,
        selectedDate: getInitialDate(),
        sortBy: 'date',
        filterStatus: 'all',

        // Actions
        setPrintModal: (open, order = null) =>
          set({ printModalOpen: open, printOrder: order }),

        setConfirmAction: (action, id = null) =>
          set({ confirmAction: action, pendingOrderId: id }),

        setItemDetailsModal: (open, order = null) =>
          set({ itemDetailsModalOpen: open, itemDetailsOrder: order }),

        setShowCompleted: (show) => set({ showCompleted: show }),

        setSelectedDate: (date) => set({ selectedDate: date }),

        setSortBy: (sort) => set({ sortBy: sort }),

        setFilterStatus: (status) => set({ filterStatus: status }),

        reset: () =>
          set({
            printModalOpen: false,
            printOrder: null,
            confirmAction: null,
            pendingOrderId: null,
            itemDetailsModalOpen: false,
            itemDetailsOrder: null,
            showCompleted: false,
            selectedDate: getInitialDate(),
          }),
      }),
      {
        name: 'order-store',
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
