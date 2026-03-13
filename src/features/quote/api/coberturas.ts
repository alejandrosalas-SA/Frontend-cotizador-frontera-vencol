import axios from '@/lib/axios';

export const getCotizacionBasica = async (id_tipo_transporte: number, id_duracion_viaje: number) => {
    const { data } = await axios.post('/Coberturas/Basica', {
        id_tipo_transporte,
        id_duracion_viaje,
    });
    return data;
};

export const getCotizacionExceso = async (id_tipo_transporte: number, id_duracion_viaje: number, id_alternativa: number) => {
    const { data } = await axios.post('/Coberturas/Exceso', {
        id_tipo_transporte,
        id_duracion_viaje,
        id_alternativa,
    });
    return data;
};

export const getCotizacionOpcional = async (payload: any) => {
    const { data } = await axios.post('/Coberturas/Opcional', payload);
    return data;
};

export const getCotizacionTotal = async (payload: any) => {
    const { data } = await axios.post('/Coberturas/Total', payload);
    return data;
};
