import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi, type LoginCredentials } from '../api/login';
import { useAuthStore } from '@/stores/auth';

export const useLogin = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => {
            return loginApi(credentials);
        },
        throwOnError: false,
        onSuccess: (data) => {
            // Guardar usuario y token en el store
            login(data.user, data.token);

            // Mostrar mensaje de éxito
            toast.success(`¡Bienvenido, ${data.user.nombre}!`, {
                position: 'top-right',
                autoClose: 3000,
            });

            // Redirigir al dashboard
            navigate('/app/dashboard');
        },
        onError: (error: Error) => {
            // Mostrar mensaje de error
            toast.error(error.message, {
                position: 'top-right',
                autoClose: 5000,
            });
        },
    });
};
