import api from '@/lib/axios';
import type { SolicitudPayload, SolicitudListItem, SolicitudDetalle, UpdateSolicitudPayload } from '@/types';

export interface CreateSolicitudResponse {
    id_solicitud: number;
    mensaje: string;
}

export const crearSolicitud = async (
    payload: SolicitudPayload
): Promise<CreateSolicitudResponse> => {
    const res = await api.post('/Solicitudes/Crear', payload);
    return res.data;
};

export const getSolicitudes = async (): Promise<SolicitudListItem[]> => {
    const res = await api.get('/Solicitudes');
    return res.data;
};

export const getSolicitudById = async (id: number): Promise<SolicitudDetalle> => {
    const res = await api.get(`/Solicitudes/${id}`);
    return res.data;
};

export const actualizarSolicitud = async (
    id: number,
    payload: UpdateSolicitudPayload
): Promise<{ mensaje: string }> => {
    const res = await api.put(`/Solicitudes/${id}`, payload);
    return res.data;
};

export const eliminarSolicitud = async (id: number): Promise<{ mensaje: string }> => {
    const res = await api.delete(`/Solicitudes/${id}`);
    return res.data;
};
