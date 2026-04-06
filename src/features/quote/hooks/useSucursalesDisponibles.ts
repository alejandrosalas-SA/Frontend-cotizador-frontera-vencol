import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { getSucursales, getSucursalesUsuario, type MaestroItem } from '../api/maestros';

/**
 * Devuelve las sucursales que el usuario autenticado puede ver:
 *   Rol 1 (Admin)      → todas las sucursales del sistema
 *   Rol 2 (Supervisor) → solo las asignadas en USUARIOS_SUCURSAL
 *   Rol 3 (Empleado)   → array vacío (no necesita filtro por sucursal)
 */
export const useSucursalesDisponibles = () => {
    const { user } = useAuthStore();
    const rol    = user?.id_rol ?? 3;
    const codEmp = user?.cod_emp ?? '';

    // Admin: todas las sucursales
    const adminQuery = useQuery<MaestroItem[]>({
        queryKey: ['sucursales-todas'],
        queryFn:  getSucursales,
        enabled:  rol === 1,
        staleTime: 10 * 60 * 1000,
    });

    // Supervisor: solo las suyas
    const supervisorQuery = useQuery<MaestroItem[]>({
        queryKey: ['sucursales-usuario', codEmp],
        queryFn:  () => getSucursalesUsuario(codEmp),
        enabled:  rol === 2 && !!codEmp,
        staleTime: 10 * 60 * 1000,
    });

    if (rol === 1) {
        return {
            sucursales: adminQuery.data ?? [],
            isLoading:  adminQuery.isLoading,
        };
    }

    if (rol === 2) {
        return {
            sucursales: supervisorQuery.data ?? [],
            isLoading:  supervisorQuery.isLoading,
        };
    }

    // Empleado
    return { sucursales: [] as MaestroItem[], isLoading: false };
};
