import api from '@/lib/axios';
import type { AuthResponse } from '@/types';

export interface LoginCredentials {
    Email: string;
    Password: string;
}

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/User/Login', credentials);
        return response.data;
    } catch (error: any) {
        // Manejo de errores específicos
        if (error.response?.status === 401) {
            throw new Error('Credenciales inválidas. Verifique su correo y contraseña.');
        }
        if (error.response?.status === 404) {
            throw new Error('Usuario no encontrado.');
        }
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error al iniciar sesión. Intente nuevamente.');
    }
};
