import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { isTokenExpired } from '@/features/auth/api/refreshToken';

// Funciones de ofuscación/deofuscación
// Usamos Base64 con reversión para ofuscar el token en localStorage
const obfuscateToken = (token: string): string => {
  // Convertir a Base64 y agregar ruido
  const base64 = btoa(token);
  const reversed = base64.split('').reverse().join('');
  return reversed;
};

const deobfuscateToken = (obfuscated: string): string => {
  try {
    const reversed = obfuscated.split('').reverse().join('');
    return atob(reversed);
  } catch (error) {
    return '';
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  obfuscatedToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
  isTokenValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      obfuscatedToken: null,
      isAuthenticated: false,

      login: (user, token) => {
        const obfuscated = obfuscateToken(token);
        set({
          user,
          token: null, // No guardamos el token sin ofuscar
          obfuscatedToken: obfuscated,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          obfuscatedToken: null,
          isAuthenticated: false,
        });
      },

      getToken: () => {
        const { obfuscatedToken } = get();
        if (!obfuscatedToken) return null;
        return deobfuscateToken(obfuscatedToken);
      },

      isTokenValid: () => {
        const token = get().getToken();
        if (!token) return false;
        return !isTokenExpired(token);
      },
    }),
    {
      name: 'altamira-auth-storage',
      // Solo persistimos user y obfuscatedToken
      partialize: (state) => ({
        user: state.user,
        obfuscatedToken: state.obfuscatedToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
