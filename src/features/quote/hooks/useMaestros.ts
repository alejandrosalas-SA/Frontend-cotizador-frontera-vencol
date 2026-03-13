import { useQuery } from '@tanstack/react-query';
import * as maestrosApi from '../api/maestros';

export const useSucursales = () => {
    return useQuery({
        queryKey: ['maestros', 'sucursales'],
        queryFn: maestrosApi.getSucursales,
        staleTime: 1000 * 60 * 60, // 1 hora
    });
};

export const useSucursalesUsuario = (codEmp?: string) => {
    return useQuery({
        queryKey: ['maestros', 'sucursales', codEmp],
        queryFn: () => maestrosApi.getSucursalesUsuario(codEmp!),
        enabled: !!codEmp,
        staleTime: 1000 * 60 * 60, // 1 hora
    });
};

export const useIntermediarios = () => {
    return useQuery({
        queryKey: ['maestros', 'intermediarios'],
        queryFn: maestrosApi.getIntermediarios,
        staleTime: 1000 * 60 * 60, // 1 hora
    });
};

export const useDuracionesViaje = () => {
    return useQuery({
        queryKey: ['maestros', 'duraciones'],
        queryFn: maestrosApi.getDuracionesViaje,
        staleTime: 1000 * 60 * 60,
    });
};

export const useTiposExceso = () => {
    return useQuery({
        queryKey: ['maestros', 'excesos'],
        queryFn: maestrosApi.getTiposExceso,
        staleTime: 1000 * 60 * 60,
    });
};

export const useTiposTransporte = () => {
    return useQuery({
        queryKey: ['maestros', 'transportes'],
        queryFn: maestrosApi.getTiposTransporte,
        staleTime: 1000 * 60 * 60,
    });
};

export const useTasacionesEspeciales = () => {
    return useQuery({
        queryKey: ['maestros', 'tasaciones'],
        queryFn: maestrosApi.getTasacionesEspeciales,
        staleTime: 1000 * 60 * 60,
    });
};

export const useMarcas = () => {
    return useQuery({
        queryKey: ['maestros', 'marcas'],
        queryFn: maestrosApi.getMarcas,
        staleTime: 1000 * 60 * 60,
    });
};

export const useModelos = (codMarca: string) => {
    return useQuery({
        queryKey: ['maestros', 'modelos', codMarca],
        queryFn: () => maestrosApi.getModelos(codMarca),
        enabled: !!codMarca,
        staleTime: 1000 * 60 * 60,
    });
};

export const useSumasAseguradas = (tipoExceso: number | null | undefined) => {
    return useQuery({
        // Incluimos tipoExceso en la queryKey para que se recargue al cambiar
        queryKey: ['maestros', 'sumas', tipoExceso],
        queryFn: () => maestrosApi.getSumasAseguradas(tipoExceso),
        staleTime: 1000 * 60 * 60,
    });
};
