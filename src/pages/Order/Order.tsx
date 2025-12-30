import NavPopup from '../../components/common/NavPopup';
import ManagementBrandedHeader from '../../components/management/ManagementBrandedHeader';
import ManagementHeaderSection from '../../components/management/ManagementHeaderSection';
import ManagementSearchBar from '../../components/management/ManagementSearchBar';
import PendingOrdersSection from './components/PendingOrdersSection';
import CompletedOrdersSection from './components/CompletedOrdersSection';
import PrintOrderModal from './components/PrintOrderModal';
import ItemDetailsModal from './components/ItemDetailsModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import { useOrders } from '../../hooks/useOrders';
import { usePageTitle } from '../../hooks/usePageTitle';
import type { OrderItem } from '../../types';

const Order: React.FC = () => {
  usePageTitle('Order Management | PRISTINE DINING');

  const {
    pendingOrders,
    completedOrders,
    selectedDate,
    pendingCount,
    completedCount,
    totalCount,
    handleCompleteOrder,
    handleDateChange,
    loadOrders,
    showCompleted,
    printModalOpen,
    printOrder,
    confirmAction,
    pendingOrderId,
    itemDetailsModalOpen,
    itemDetailsOrder,
    setShowCompleted,
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
  } = useOrders();

  const { mainLayoutStyle, cardsGridStyle } = useResponsiveGrid(false);

  const handleRefresh = () => {
    loadOrders();
  };

  const handlePrintOrder = (order: OrderItem) => {
    setPrintModal(true, order);
  };

  const closePrintModal = () => {
    setPrintModal(false, null);
  };

  const handleViewItemDetails = (order: OrderItem) => {
    setItemDetailsModal(true, order);
  };

  const closeItemDetailsModal = () => {
    setItemDetailsModal(false, null);
  };

  const handleConfirmComplete = (id: string) => {
    setConfirmAction('complete', id);
  };

  const handleConfirmAction = () => {
    if (!pendingOrderId) return;

    if (confirmAction === 'complete') {
      handleCompleteOrder(pendingOrderId);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null, null);
  };

  const getPendingOrder = () => {
    return pendingOrders.find((order) => order.oid === pendingOrderId);
  };

  return (
    <>
      <div className='management-page-wrapper'>
        <div className='management-page-container'>
          <ManagementBrandedHeader icon='utensils' title='PRISTINE DINING' subtitle='Order Management System' />

          <ManagementHeaderSection
            titleIcon='receipt'
            title='Orders'
            subtitle='Manage and track all customer orders'
            totalCount={totalCount}
            pendingCount={pendingCount}
            completedCount={completedCount}
            showCompleted={showCompleted}
            onToggleView={setShowCompleted}
          />

          <ManagementSearchBar selectedDate={selectedDate} onDateChange={handleDateChange} onRefresh={handleRefresh} />

          <div className='main-layout' style={mainLayoutStyle}>
            {!showCompleted ? (
              <PendingOrdersSection
                orders={pendingOrders}
                cardsGridStyle={cardsGridStyle}
                pendingCount={pendingCount}
                onPrint={handlePrintOrder}
                onViewDetails={handleViewItemDetails}
                onConfirmComplete={handleConfirmComplete}
              />
            ) : (
              <CompletedOrdersSection
                orders={completedOrders}
                cardsGridStyle={cardsGridStyle}
                completedCount={completedCount}
                onViewDetails={handleViewItemDetails}
              />
            )}
          </div>
        </div>
      </div>

      <PrintOrderModal isOpen={printModalOpen} order={printOrder} onClose={closePrintModal} />

      <ItemDetailsModal isOpen={itemDetailsModalOpen} item={itemDetailsOrder} onClose={closeItemDetailsModal} />

      {/* Confirmation Modal */}
      {confirmAction === 'complete' && getPendingOrder() && (
        <ConfirmModal
          isOpen={true}
          title='Mark as Done'
          message={`Are you sure you want to mark order ${pendingOrderId} as done? This action can be reversed.`}
          confirmText='Mark as Done'
          cancelText='Cancel'
          onConfirm={handleConfirmAction}
          onCancel={handleCancelConfirm}
          isDangerous={false}
          buttonColor='success'
        />
      )}

      <NavPopup currentPath='/order' />
    </>
  );
};

export default Order;
