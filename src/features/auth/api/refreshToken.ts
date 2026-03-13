import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/auth';

interface TokenPayload {
    id: string;
    role: string;
    email: string;
    exp: number;
    iat: number;
}

/**
 * Verifica si el token está próximo a expirar (menos de 30 minutos)
 */
export const isTokenExpiringSoon = (token: string): boolean => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
        const currentTime = Date.now();
        const timeUntilExpiration = expirationTime - currentTime;
        const thirtyMinutes = 30 * 60 * 1000;

        return timeUntilExpiration < thirtyMinutes && timeUntilExpiration > 0;
    } catch (error) {
        return false;
    }
};

/**
 * Verifica si el token ya expiró
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const expirationTime = decoded.exp * 1000;
        return Date.now() >= expirationTime;
    } catch (error) {
        return true;
    }
};

/**
 * Intenta renovar el token llamando nuevamente al endpoint de login
 * NOTA: El backend actual no tiene un endpoint específico de refresh token,
 * por lo que esta función está preparada para cuando se implemente.
 * Por ahora, simplemente valida el token.
 */
export const refreshTokenApi = async (): Promise<string | null> => {
    const { token, user } = useAuthStore.getState();

    if (!token || !user) {
        return null;
    }

    // Verificar si el token está expirado
    if (isTokenExpired(token)) {
        // Token expirado, hacer logout
        useAuthStore.getState().logout();
        return null;
    }

    // Si el token está próximo a expirar, podríamos implementar
    // un endpoint de refresh en el backend. Por ahora, retornamos el token actual.
    // TODO: Implementar endpoint /RefreshToken en el backend

    return token;
};

/**
 * Decodifica el token y retorna el payload
 */
export const decodeToken = (token: string): TokenPayload | null => {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch (error) {
        return null;
    }
};
