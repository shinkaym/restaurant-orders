import React from 'react';
import clsx from 'clsx';

type ButtonColor = 'primary' | 'success' | 'danger';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
  buttonColor?: ButtonColor;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
  buttonColor = 'primary',
}) => {
  if (!isOpen) return null;

  const getButtonClass = (): string => {
    return clsx({
      'modal-btn-danger': isDangerous,
      'modal-btn-success': buttonColor === 'success' && !isDangerous,
      'modal-btn-primary': !isDangerous && buttonColor !== 'success',
    });
  };

  const getIcon = (): string => {
    if (isDangerous) return 'fa-trash';
    return 'fa-check';
  };

  const getHeaderIcon = (): string => {
    if (isDangerous) return 'fa-exclamation-triangle';
    if (buttonColor === 'success') return 'fa-check-circle';
    return 'fa-question-circle';
  };

  return (
    <div className="modal-overlay active">
      <div className="modal confirm-modal">
        <div className="modal-header">
          <h2>
            <i className={`fas ${getHeaderIcon()}`}></i>
            {title}
          </h2>
          <button className="modal-close-btn" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onCancel}>
            <i className="fas fa-times"></i> {cancelText}
          </button>
          <button className={clsx('modal-btn', getButtonClass())} onClick={onConfirm}>
            <i className={`fas ${getIcon()}`}></i> {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
