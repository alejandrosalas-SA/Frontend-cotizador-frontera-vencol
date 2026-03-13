import { useAuthStore } from '@/stores/auth';

export const logoutApi = () => {
    // Limpiar el store de Zustand
    useAuthStore.getState().logout();

    // Limpiar cualquier otro dato de sesión si es necesario
    // Por ejemplo, limpiar cache de React Query

    return Promise.resolve();
};
