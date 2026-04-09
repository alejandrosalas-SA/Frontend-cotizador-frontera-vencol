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

        // Manejo de errores de validación y de servidor
        const data = error.response?.data;
        if (data) {
            if (data.msg) throw new Error(data.msg);
            if (data.message) throw new Error(data.message);
            if (data.error?.message) throw new Error(data.error.message);
            // Si el backend envía {"error": "...", "details": [{ "msg": "..." }]}
            if (Array.isArray(data.details) && data.details.length > 0 && data.details[0].msg) {
                throw new Error(data.details[0].msg);
            }
            // Mantenemos "errors" por si hay otras rutas que usen ese formato estándar
            if (Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0].msg) {
                throw new Error(data.errors[0].msg);
            }
        }

        throw new Error('Error al cambiar la contraseña. Intente nuevamente.');
    }
};
