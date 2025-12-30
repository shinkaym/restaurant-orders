import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    duration: options?.duration ?? 3000,
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    duration: options?.duration ?? 3000,
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const updateToastSuccess = (toastId: string, message: string, options?: ToastOptions) => {
  toast.success(message, {
    id: toastId,
    duration: options?.duration ?? 3000,
  });
};

export const updateToastError = (toastId: string, message: string, options?: ToastOptions) => {
  toast.error(message, {
    id: toastId,
    duration: options?.duration ?? 3000,
  });
};
