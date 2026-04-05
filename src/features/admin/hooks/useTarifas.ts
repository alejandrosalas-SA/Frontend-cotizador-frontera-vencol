import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTarifas, updateTarifa, getTasasOpcionales, updateTasaOpcional } from '../api/tarifas';
import type { UpdateTarifaPayload, UpdateTasaOpcionalPayload } from '@/types';

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

export const useTasasOpcionales = () =>
  useQuery({ queryKey: ['tasas-opcionales'], queryFn: getTasasOpcionales });

export const useUpdateTasaOpcional = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTasaOpcionalPayload }) =>
      updateTasaOpcional(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasas-opcionales'] }),
  });
};