import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: number; // id_rol requerido (ej: 2 para Supervisor)
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole !== undefined && user.id_rol !== requiredRole) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-16 w-16 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Acceso Denegado</h2>
                    <p className="text-slate-600 mb-6">
                        No tienes permisos suficientes para acceder a esta sección.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-[#003366] text-white rounded-md hover:bg-blue-900 transition-colors"
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    // Usuario autenticado y con rol correcto
    return <>{children}</>;
};
