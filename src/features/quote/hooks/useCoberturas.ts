import { useQuery } from '@tanstack/react-query';
import { getCotizacionBasica, getCotizacionExceso, getCotizacionOpcional } from '../api/coberturas';
import { useMutation } from '@tanstack/react-query';
import { calcularCotizacion } from '../api/cotizacion';
export const useCotizacionBasica = (idTipoTransporte?: number, idDuracionViaje?: number) => {
    return useQuery({
        queryKey: ['cotizacion-basica', idTipoTransporte, idDuracionViaje],
        queryFn: () => getCotizacionBasica(idTipoTransporte!, idDuracionViaje!),
        enabled: !!idTipoTransporte && !!idDuracionViaje,
    });
};

export const useCotizacionExceso = (idTipoTransporte?: number, idDuracionViaje?: number, idAlternativa?: number) => {
    return useQuery({
        queryKey: ['cotizacion-exceso', idTipoTransporte, idDuracionViaje, idAlternativa],
        queryFn: () => getCotizacionExceso(idTipoTransporte!, idDuracionViaje!, idAlternativa!),
        enabled: !!idTipoTransporte && !!idDuracionViaje && !!idAlternativa,
    });
};

export const useCotizacionOpcional = (payload: any) => {
    return useQuery({
        queryKey: ['cotizacion-opcional', payload],
        queryFn: () => getCotizacionOpcional(payload),
        enabled: !!payload,
    });
};



export const useCalcularCotizacionMutation = () => {
    return useMutation({
        mutationFn: ({ vehiculo, nro_version }: { vehiculo: any, nro_version?: string }) =>
            calcularCotizacion(vehiculo, nro_version),
    });
};
