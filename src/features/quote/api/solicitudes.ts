import api from '@/lib/axios';
import type { SolicitudPayload, SolicitudesResponse, SolicitudDetalle, UpdateSolicitudPayload } from '@/types';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export interface CreateSolicitudResponse {
    id_solicitud: number;
    mensaje: string;
}

export interface GetSolicitudesParams {
    pagina: number;
    tamanoPagina: number;
    solicitante: string;
    vehiculo: string;
    status: string;
    dateRange: DateRange | undefined;
}

export const getSolicitudes = async (
    params: GetSolicitudesParams
): Promise<SolicitudesResponse> => {
    const query: Record<string, string | number> = {
        pagina: params.pagina,
        tamanoPagina: params.tamanoPagina,
    };

    if (params.solicitante) query.solicitante = params.solicitante;
    if (params.vehiculo)    query.vehiculo    = params.vehiculo;
    if (params.status !== 'all') query.status = params.status;
    if (params.dateRange?.from) query.fechaDesde = format(params.dateRange.from, 'yyyy-MM-dd');
    if (params.dateRange?.to)   query.fechaHasta = format(params.dateRange.to,   'yyyy-MM-dd');

    const res = await api.get('/Solicitudes', { params: query });
    const raw = res.data;
    return {
        data: raw.data,
        meta: { ...raw.meta, tiene_filtros: Boolean(raw.meta?.tiene_filtros) },
    };
};

export const getSolicitudById = async (id: number): Promise<SolicitudDetalle> => {
    const res = await api.get(`/Solicitudes/${id}`);
    return res.data;
};

export const crearSolicitud = async (
    payload: SolicitudPayload
): Promise<CreateSolicitudResponse> => {
    const res = await api.post('/Solicitudes/Crear', payload);
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

export interface ConteosSolicitudes {
    total: number;
    generadas: number;
    borradores: number;
}

export const getConteosSolicitudes = async (): Promise<ConteosSolicitudes> => {
    const res = await api.get('/Solicitudes/conteos');
    return res.data;
};
