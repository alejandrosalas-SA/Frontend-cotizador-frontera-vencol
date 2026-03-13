import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as solicitudesApi from '../api/solicitudes';
import type { SolicitudPayload, UpdateSolicitudPayload } from '@/types';

const QUERY_KEY = 'solicitudes';

// Hook para listar todas las solicitudes del usuario
export const useSolicitudesList = () => {
    return useQuery({
        queryKey: [QUERY_KEY],
        queryFn: solicitudesApi.getSolicitudes,
        staleTime: 1000 * 30, // Consideramos los datos "frescos" por 30 segundos
        refetchInterval: 1000 * 60, // Actualización automática en segundo plano cada 1 minuto
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

// Hook para eliminar
export const useEliminarSolicitud = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => solicitudesApi.eliminarSolicitud(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    });
};
