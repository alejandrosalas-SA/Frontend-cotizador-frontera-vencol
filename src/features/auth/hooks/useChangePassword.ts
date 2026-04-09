import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { changePasswordApi, type ChangePasswordPayload } from '../api/changePassword';

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => changePasswordApi(payload),
        onSuccess: (data) => {
            // Mostrar mensaje de éxito
            toast.success(data.message || 'Contraseña cambiada exitosamente', {
                position: 'top-right',
                autoClose: 4000,
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.response?.data?.error?.message || error.message;
            // Mostrar mensaje de error
            toast.error(errorMessage || 'Error al cambiar la contraseña. Intente nuevamente.', {
                position: 'top-right',
                autoClose: 5000,
            });
        },
    });
};
