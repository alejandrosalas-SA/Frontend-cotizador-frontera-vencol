import api from '@/lib/axios';
import type { DashboardEstadisticas, MiniPanelEstadisticas } from '@/types';

export const getEstadisticas = async (): Promise<DashboardEstadisticas> =>
  api.get('/Estadisticas/dashboard').then((r) => r.data);

export const getMiniPanel = async (): Promise<MiniPanelEstadisticas> =>
  api.get('/Estadisticas/mini-panel').then((r) => r.data);
