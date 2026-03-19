import api from '@/lib/axios';
import type { SumaAsegurada, UpdateSumaAseguradaPayload } from '@/types';

export interface SumasAseguradasResponse {
  basico: SumaAsegurada[];
  exceso: SumaAsegurada[];
  opcional: SumaAsegurada[];
}

export const getSumasAseguradas = async (): Promise<SumasAseguradasResponse> =>
  api.get('/Maestros/SumasAseguradas').then((res) => res.data);

export const updateSumaAsegurada = async (
  id: number,
  payload: UpdateSumaAseguradaPayload
): Promise<{ mensaje: string }> =>
  api.put(`/Maestros/SumasAseguradas/${id}`, payload).then((res) => res.data);