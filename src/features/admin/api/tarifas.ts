import api from '@/lib/axios';
import type { Tarifa, UpdateTarifaPayload } from '@/types';

export const getTarifas = async (): Promise<Tarifa[]> =>
  api.get('/Tarifas').then((res) => res.data);

export const updateTarifa = async (
  id: number,
  payload: UpdateTarifaPayload
): Promise<{ mensaje: string }> =>
  api.put(`/Tarifas/${id}`, payload).then((res) => res.data);