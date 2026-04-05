import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as solicitudesApi from '../api/solicitudes';
import type { SolicitudPayload, UpdateSolicitudPayload } from '@/types';
import { useSolicitudesStore } from '@/stores/useSolicitudesStore';

const QUERY_KEY = 'solicitudes';
const TAMANO_PAGINA = 10;

// Hook principal para la lista de solicitudes con paginación y filtros server-side.
// Lee filtros y página directamente del store — sin prop-drilling.
export const useSolicitudesList = () => {
    const {
        searchApplicant,
        searchVehicle,
        statusFilter,
        dateRange,
        paginaActual,
    } = useSolicitudesStore();

    return useQuery({
        queryKey: [
            QUERY_KEY,
            paginaActual,
            searchApplicant,
            searchVehicle,
            statusFilter,
            dateRange?.from?.toISOString(),
            dateRange?.to?.toISOString(),
        ],
        queryFn: () =>
            solicitudesApi.getSolicitudes({
                pagina: paginaActual,
                tamanoPagina: TAMANO_PAGINA,
                solicitante: searchApplicant,
                vehiculo: searchVehicle,
                status: statusFilter,
                dateRange,
            }),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
        placeholderData: (prev) => prev, // mantiene datos previos al cambiar de página (evita parpadeo)
    });
};

// Hook para obtener el detalle de una solicitud
export const useSolicitudDetalle = (id: number | null) => {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => solicitudesApi.getSolicitudById(id!),
        enabled: !!id,
    });
};

// Hook para crear nueva solicitud
export const useCreateSolicitud = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: SolicitudPayload) => solicitudesApi.crearSolicitud(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    });
};

// Hook para actualizar status/condiciones/observaciones
export const useActualizarSolicitud = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateSolicitudPayload }) =>
            solicitudesApi.actualizarSolicitud(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    });
};

// Hook para conteos del dashboard
export const useConteosSolicitudes = () => {
    return useQuery({
        queryKey: [QUERY_KEY, 'conteos'],
        queryFn: solicitudesApi.getConteosSolicitudes,
        staleTime: 1000 * 30,
    });
};

// Hook para eliminar
export const useEliminarSolicitud = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => solicitudesApi.eliminarSolicitud(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    });
};
