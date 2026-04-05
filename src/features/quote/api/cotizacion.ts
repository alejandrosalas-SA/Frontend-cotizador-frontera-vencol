import api from '@/lib/axios';
import type { Vehiculo } from '@/types';

export interface CotizacionResponse {
    nro_version: string;
    prima_basica: number;
    prima_exceso: number;
    prima_muerte_accidental: number;
    prima_gastos_medicos: number;
    prima_invalidez: number;
    prima_total: number;
}

export const calcularCotizacion = async (
    vehiculo: Vehiculo,
    nro_version?: string,
    con_opcional?: boolean
): Promise<CotizacionResponse> => {
    const res = await api.post('/Cotizacion/calcular', {
        ...vehiculo,
        nro_version_buscada: nro_version,
        con_opcional: con_opcional ? 1 : 0
    });
    return res.data;
};
