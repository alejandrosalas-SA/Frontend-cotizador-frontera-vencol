import { useQuery } from '@tanstack/react-query';
import type { DashboardEstadisticas } from '@/types';
import { getEstadisticas } from '../api/estadisticas';

export const useEstadisticas = (idSucursal?: number | null) =>
  useQuery<DashboardEstadisticas>({
    queryKey: ['estadisticas-dashboard', idSucursal ?? null],
    queryFn:  () => getEstadisticas(idSucursal),
    staleTime: 5 * 60 * 1000,
  });
