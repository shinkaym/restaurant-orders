import toast from 'react-hot-toast';

/**
 * Toast utility helper for consistent toast notifications across the app
 * Auto-closes after 3 seconds for all types
 */

interface ToastOptions {
  duration?: number;
}

/**
 * Show success toast notification
 * Auto-closes after 3 seconds
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    duration: options?.duration ?? 3000,
  });
};

/**
 * Show error toast notification
 * Auto-closes after 3 seconds
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    duration: options?.duration ?? 3000,
  });
};

/**
 * Show loading toast notification
 * Returns toast ID for later updating/dismissing
 */
export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

/**
 * Update loading toast to success
 * Auto-closes after 3 seconds
 */
export const updateToastSuccess = (
  toastId: string,
  message: string,
  options?: ToastOptions
) => {
  toast.success(message, {
    id: toastId,
    duration: options?.duration ?? 3000,
  });
};

/**
 * Update loading toast to error
 * Auto-closes after 3 seconds
 */
export const updateToastError = (
  toastId: string,
  message: string,
  options?: ToastOptions
) => {
  toast.error(message, {
    id: toastId,
    duration: options?.duration ?? 3000,
  });
};

