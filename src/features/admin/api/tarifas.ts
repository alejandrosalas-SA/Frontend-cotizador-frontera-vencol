import api from '@/lib/axios';
import type { Tarifa, UpdateTarifaPayload, TasaOpcional, UpdateTasaOpcionalPayload } from '@/types';

export const getTarifas = async (): Promise<Tarifa[]> =>
  api.get('/Tarifas').then((res) => res.data);

export const updateTarifa = async (
  id: number,
  payload: UpdateTarifaPayload
): Promise<{ mensaje: string }> =>
  api.put(`/Tarifas/${id}`, payload).then((res) => res.data);

export const getTasasOpcionales = async (): Promise<TasaOpcional[]> =>
  api.get('/Tarifas/Opcionales').then((res) => res.data);

export const updateTasaOpcional = async (
  id: number,
  payload: UpdateTasaOpcionalPayload
): Promise<{ mensaje: string }> =>
  api.put(`/Tarifas/Opcionales/${id}`, { tasa: payload.tasa }).then((res) => res.data);