import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutApi } from '../api/logout';
import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logout = () => {
        // Limpiar el estado de autenticación
        logoutApi();

        // Limpiar cache de React Query
        queryClient.clear();

        // Mostrar mensaje
        toast.info('Sesión cerrada correctamente', {
            position: 'top-right',
            autoClose: 2000,
        });

        // Redirigir al login
        navigate('/auth/login');
    };

    return { logout };
};
