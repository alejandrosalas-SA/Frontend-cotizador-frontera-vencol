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
        const resData = error.response?.data;
        if (resData) {
            if (resData.msg) throw new Error(resData.msg);
            if (resData.message) throw new Error(resData.message);
            if (resData.error?.message) throw new Error(resData.error.message);
            if (Array.isArray(resData.details) && resData.details.length > 0 && resData.details[0].msg) {
                throw new Error(resData.details[0].msg);
            }
            if (Array.isArray(resData.errors) && resData.errors.length > 0 && resData.errors[0].msg) {
                throw new Error(resData.errors[0].msg);
            }
        }
        throw new Error('Error al crear la contraseña. Intente nuevamente.');
    }
};
