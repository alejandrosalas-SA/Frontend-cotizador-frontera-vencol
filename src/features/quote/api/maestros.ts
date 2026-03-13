import api from '@/lib/axios';

export interface MaestroItem {
    id: number;
    nombre: string;
    etiqueta?: string;
}

export interface IntermediarioItem {
    id: string | number;
    nombre: string;
}

export interface MarcaItem {
    cod_marca: string;
    marca: string;
}

export interface ModeloItem {
    codmodelo: string;
    descmodelo: string;
}

export interface SumaAseguradaItem {
    id_def_termino: number;
    tipo_cobertura: string;
    tipo_exceso: number | null;
    valor: number;
}

export interface SumasAseguradasResponse {
    basico: SumaAseguradaItem[];
    exceso: SumaAseguradaItem[];
    opcional: SumaAseguradaItem[];
}

export const getIntermediarios = async (): Promise<IntermediarioItem[]> => {
    const res = await api.get('/maestros/Intermediarios');
    return res.data;
};

export const getSucursales = async (): Promise<MaestroItem[]> => {
    const res = await api.get('/maestros/Sucursales');
    return res.data;
};

export const getSucursalesUsuario = async (codEmp: string): Promise<MaestroItem[]> => {
    const res = await api.get(`/maestros/SucursalesUsuario/${codEmp}`);
    return res.data;
};

export const getDuracionesViaje = async (): Promise<MaestroItem[]> => {
    const res = await api.get('/maestros/DuracionViaje');
    return res.data;
};

export const getTiposExceso = async (): Promise<MaestroItem[]> => {
    const res = await api.get('/maestros/TipoExceso');
    return res.data;
};

export const getTiposTransporte = async (): Promise<MaestroItem[]> => {
    const res = await api.get('/maestros/TipoTransporte');
    return res.data;
};

export const getTasacionesEspeciales = async (): Promise<MaestroItem[]> => {
    const res = await api.get('/maestros/TasacionEspecial');
    return res.data;
};

export const getMarcas = async (): Promise<MarcaItem[]> => {
    const res = await api.get('/maestros/Marcas');
    return res.data;
};

export const getModelos = async (codMarca: string): Promise<ModeloItem[]> => {
    const res = await api.get(`/maestros/Modelos/${codMarca}`);
    return res.data;
};

export const getSumasAseguradas = async (tipoExceso?: number | null): Promise<SumasAseguradasResponse> => {
    const url = tipoExceso ? `/maestros/SumasAseguradas/${tipoExceso}` : '/maestros/SumasAseguradas';
    const res = await api.get(url);
    return res.data;
};
