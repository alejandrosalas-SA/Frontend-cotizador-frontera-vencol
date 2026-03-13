import api from '@/lib/axios';

export interface ChangePasswordPayload {
    Email: string;
    PasswordOld: string;
    PasswordNew: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

export const changePasswordApi = async (
    payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
    try {
        const response = await api.post<ChangePasswordResponse>('/User/ChangePassword', payload);
        return response.data;
    } catch (error: any) {
        // Manejo de errores específicos
        if (error.response?.status === 401) {
            throw new Error('La contraseña actual es incorrecta.');
        }
        if (error.response?.status === 404) {
            throw new Error('Usuario no encontrado.');
        }
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error al cambiar la contraseña. Intente nuevamente.');
    }
};
