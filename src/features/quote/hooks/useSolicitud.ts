import { useMutation } from '@tanstack/react-query';
import * as solicitudesApi from '../api/solicitudes';
import type { SolicitudPayload } from '@/types';

/** @deprecated Use useCreateSolicitud from useSolicitudes instead */
export const useCreateSolicitud = () => {
    return useMutation({
        mutationFn: (payload: SolicitudPayload) =>
            solicitudesApi.crearSolicitud(payload),
    });
};
