import api from '@/lib/axios';
import type { DashboardEstadisticas, MiniPanelEstadisticas } from '@/types';

export const getEstadisticas = async (idSucursal?: number | null): Promise<DashboardEstadisticas> => {
  const params: Record<string, string | number> = {};
  if (idSucursal != null) params.id_sucursal = idSucursal;
  return api.get('/Estadisticas/dashboard', { params }).then((r) => r.data);
};

export const getMiniPanel = async (): Promise<MiniPanelEstadisticas> =>
  api.get('/Estadisticas/mini-panel').then((r) => r.data);
