import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de Request: Inyectar Token en cada petición
api.interceptors.request.use(
  (config) => {
    const { getToken, isTokenValid, isAuthenticated, logout } = useAuthStore.getState();

    if (!isAuthenticated) {
      // Usuario no autenticado (ej. pantalla de login): no agregar header,
      // dejar que la petición continúe normalmente.
      return config;
    }

    if (isTokenValid()) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      // Usuario tenía sesión pero el token expiró localmente antes de la petición.
      // Hacer logout; el response interceptor manejará la redirección si el
      // servidor también responde 401.
      logout();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: Manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { isAuthenticated, logout } = useAuthStore.getState();

      // Solo redirigir si el usuario TENÍA sesión activa y el servidor la rechazó
      // (token expirado/inválido en el servidor).
      // Si isAuthenticated es false, el 401 viene de un intento de login con
      // credenciales incorrectas — dejar que el onError del hook lo maneje con toast.
      if (isAuthenticated) {
        logout();
        window.location.replace('/auth/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
