import NavPopup from '../../components/common/NavPopup';
import ManagementBrandedHeader from '../../components/management/ManagementBrandedHeader';
import ManagementHeaderSection from '../../components/management/ManagementHeaderSection';
import ManagementSearchBar from '../../components/management/ManagementSearchBar';
import PendingReservationsSection from './components/PendingReservationsSection';
import CompletedReservationsSection from './components/CompletedReservationsSection';
import PrintReservationModal from './components/PrintReservationModal';
import ItemDetailsModal from './components/ItemDetailsModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useResponsiveGrid } from '../../hooks/useResponsiveGrid';
import { useReservations } from '../../hooks/useReservations';
import { usePageTitle } from '../../hooks/usePageTitle';
import type { ReservationItem } from '../../types';

const Reservation: React.FC = () => {
  usePageTitle('Reservation Management | PRISTINE DINING');

  const {
    pendingReservations,
    completedReservations,
    selectedDate,
    pendingCount,
    completedCount,
    totalCount,
    handleCompleteReservation,
    handleDateChange,
    loadReservations,
    showCompleted,
    printModalOpen,
    printReservation,
    confirmAction,
    pendingReservationId,
    itemDetailsModalOpen,
    itemDetailsReservation,
    setShowCompleted,
    setPrintModal,
    setConfirmAction,
    setItemDetailsModal,
  } = useReservations();

  const { mainLayoutStyle, cardsGridStyle } = useResponsiveGrid(false);

  const handleRefresh = () => {
    loadReservations();
  };

  const handlePrintReservation = (reservation: ReservationItem) => {
    setPrintModal(true, reservation);
  };

  const closePrintModal = () => {
    setPrintModal(false, null);
  };

  const handleViewItemDetails = (reservation: ReservationItem) => {
    setItemDetailsModal(true, reservation);
  };

  const closeItemDetailsModal = () => {
    setItemDetailsModal(false, null);
  };

  const handleConfirmComplete = (id: string) => {
    setConfirmAction('complete', id);
  };

  const handleConfirmAction = () => {
    if (!pendingReservationId) return;

    if (confirmAction === 'complete') {
      handleCompleteReservation(pendingReservationId);
    }
  };

  const handleCancelConfirm = () => {
    setConfirmAction(null, null);
  };

  const getPendingReservation = () => {
    return pendingReservations.find((res) => res.rid === pendingReservationId);
  };

  return (
    <>
      <div className='management-page-wrapper'>
        <div className='management-page-container'>
          <ManagementBrandedHeader
            icon='calendar-check'
            title='PRISTINE DINING'
            subtitle='Reservation Management System'
          />

          <ManagementHeaderSection
            titleIcon='calendar-alt'
            title='Reservations'
            subtitle='Manage and track all guest reservations'
            totalCount={totalCount}
            pendingCount={pendingCount}
            completedCount={completedCount}
            showCompleted={showCompleted}
            onToggleView={setShowCompleted}
          />

          <ManagementSearchBar selectedDate={selectedDate} onDateChange={handleDateChange} onRefresh={handleRefresh} />

          <div className='main-layout' style={mainLayoutStyle}>
            {!showCompleted ? (
              <PendingReservationsSection
                reservations={pendingReservations}
                cardsGridStyle={cardsGridStyle}
                pendingCount={pendingCount}
                onPrint={handlePrintReservation}
                onViewDetails={handleViewItemDetails}
                onConfirmComplete={handleConfirmComplete}
              />
            ) : (
              <CompletedReservationsSection
                reservations={completedReservations}
                cardsGridStyle={cardsGridStyle}
                completedCount={completedCount}
                onViewDetails={handleViewItemDetails}
              />
            )}
          </div>
        </div>
      </div>

      <PrintReservationModal isOpen={printModalOpen} reservation={printReservation} onClose={closePrintModal} />

      <ItemDetailsModal isOpen={itemDetailsModalOpen} item={itemDetailsReservation} onClose={closeItemDetailsModal} />

      {/* Confirmation Modal */}
      {confirmAction === 'complete' && getPendingReservation() && (
        <ConfirmModal
          isOpen={true}
          title='Check In'
          message={`Are you sure you want to check in reservation ${pendingReservationId}? This action can be reversed.`}
          confirmText='Check In'
          cancelText='Cancel'
          onConfirm={handleConfirmAction}
          onCancel={handleCancelConfirm}
          isDangerous={false}
          buttonColor='success'
        />
      )}

      <NavPopup currentPath='/reservation' />
    </>
  );
};

export default Reservation;
