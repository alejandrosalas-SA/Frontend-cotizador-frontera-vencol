import api from '@/lib/axios';

export interface CreatePasswordCredentials {
    Email: string;
    Password: string;
    Token?: string;
}

export interface CreatePasswordResponse {
    respuesta: string;
    justificacion: string;
}

export const createPasswordApi = async (data: CreatePasswordCredentials): Promise<CreatePasswordResponse> => {
    try {
        const response = await api.post<CreatePasswordResponse>('/User/CreatePassword', data);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error al crear la contraseña. Intente nuevamente.');
    }
};
