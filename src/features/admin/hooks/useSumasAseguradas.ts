import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSumasAseguradas, updateSumaAsegurada } from '../api/sumasAseguradas';
import api from '@/lib/axios';
import type { UpdateSumaAseguradaPayload, DefinicionTermino } from '@/types';

export const useSumasAseguradas = () =>
  useQuery({ queryKey: ['sumas-aseguradas'], queryFn: getSumasAseguradas });

export const useDefinicionTerminos = () =>
  useQuery<DefinicionTermino[]>({
    queryKey: ['definicion-terminos'],
    queryFn: () => api.get('/Maestros/DefinicionTerminos').then((res) => res.data),
    staleTime: Infinity,
  });

export const useUpdateSumaAsegurada = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateSumaAseguradaPayload;
    }) => updateSumaAsegurada(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sumas-aseguradas'] }),
  });
};