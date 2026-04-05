import { useQuery } from '@tanstack/react-query';
import type { MiniPanelEstadisticas } from '@/types';
import { getMiniPanel } from '../api/estadisticas';

export const useMiniPanel = () =>
  useQuery<MiniPanelEstadisticas>({
    queryKey: ['mini-panel-estadisticas'],
    queryFn: getMiniPanel,
    staleTime: 5 * 60 * 1000,
  });
