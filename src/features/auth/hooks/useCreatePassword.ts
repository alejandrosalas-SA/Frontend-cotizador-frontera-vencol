import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createPasswordApi, type CreatePasswordCredentials } from '../api/createPassword';

export const useCreatePassword = () => {
    return useMutation({
        mutationFn: (data: CreatePasswordCredentials) => {
            return createPasswordApi(data);
        },
        onSuccess: () => {
            toast.success('Contraseña creada exitosamente. Ahora puedes iniciar sesión.', {
                position: 'top-right',
                autoClose: 4000
            });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message;

            if (errorMessage === 'USER_ALREADY_HAS_PASSWORD') {
                toast.warning('Ya tienes una contraseña establecida. Si no la recuerdas, por favor ve al módulo de cambiar contraseña.', {
                    autoClose: 8000,
                    position: 'top-center',
                });
                return;
            }

            toast.error(errorMessage || 'Error al crear la contraseña');
        },
    });
};
