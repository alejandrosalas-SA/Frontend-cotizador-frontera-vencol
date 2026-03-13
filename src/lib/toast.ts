import { toast, type ToastOptions } from 'react-toastify';

const baseOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 4500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const useToast = () => {
    const success = (message: string, options?: ToastOptions) =>
        toast.success(message, { ...baseOptions, ...options });

    const error = (message: string, options?: ToastOptions) =>
        toast.error(message, { ...baseOptions, ...options });

    const warn = (message: string, options?: ToastOptions) =>
        toast.warn(message, { ...baseOptions, ...options });

    const info = (message: string, options?: ToastOptions) =>
        toast.info(message, { ...baseOptions, ...options });

    return { success, error, warn, info };
};
