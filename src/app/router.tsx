import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginRoute } from './routes/auth/login';
import { AppRoot } from '../components/layouts/root';
import { DashboardRoute } from './routes/app/dashboard';
import { QuoteRoute } from './routes/app/quote';
import { ChangePasswordRoute } from './routes/app/change-password';
import { CreatePasswordRoute } from './routes/auth/create-password';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { SolicitudesRoute } from './routes/app/solicitudes';
import { PrimasRoute } from './routes/app/primas';
import { EstadisticasRoute } from './routes/app/estadisticas';

export const createAppRouter = () =>
  createBrowserRouter([
    // 1. Rutas Públicas (Auth)
    {
      path: '/auth/login',
      element: <LoginRoute />,
    },
    {
      path: '/auth/cambiar-contrasena',
      element: <ChangePasswordRoute />,
    },
    {
      path: '/auth/crear-contrasena',
      element: <CreatePasswordRoute />,
    },

    // 2. Rutas Protegidas (App)
    {
      path: '/app',
      element: <AppRoot />,
      children: [
        {
          path: '',
          element: <Navigate to="dashboard" replace />,
        },
        {
          // Todos los roles autenticados
          path: 'dashboard',
          element: <DashboardRoute />,
        },
        {
          // Todos los roles autenticados
          path: 'cotizar/:id?',
          element: <QuoteRoute />,
        },
        {
          // Todos los roles autenticados (el backend filtra según el rol)
          path: 'solicitudes',
          element: <SolicitudesRoute />,
        },
        {
          // Solo Administrador y Supervisor
          path: 'estadisticas',
          element: (
            <ProtectedRoute allowedRoles={[1, 2]}>
              <EstadisticasRoute />
            </ProtectedRoute>
          ),
        },
        {
          // Solo Administrador
          path: 'primas',
          element: (
            <ProtectedRoute allowedRoles={[1]}>
              <PrimasRoute />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // 3. Redirección raíz
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />,
    },
    {
      path: '*',
      element: <Navigate to="/auth/login" replace />,
    },
  ]);
