import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTarifas, updateTarifa } from '../api/tarifas';
import type { UpdateTarifaPayload } from '@/types';

export const useTarifas = () =>
  useQuery({ queryKey: ['tarifas'], queryFn: getTarifas });

export const useUpdateTarifa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTarifaPayload }) =>
      updateTarifa(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tarifas'] }),
  });
};