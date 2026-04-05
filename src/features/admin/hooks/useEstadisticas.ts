import { useQuery } from '@tanstack/react-query';
import type { DashboardEstadisticas } from '@/types';
import { getEstadisticas } from '../api/estadisticas';

export const useEstadisticas = () =>
  useQuery<DashboardEstadisticas>({
    queryKey: ['estadisticas-dashboard'],
    queryFn: getEstadisticas,
    staleTime: 5 * 60 * 1000,
  });
