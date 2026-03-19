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

export const createAppRouter = () =>
  createBrowserRouter([
    // 1. Ruta Pública (Auth)
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
          path: 'dashboard',
          element: <DashboardRoute />,
        },
        {
          path: 'cotizar/:id?',
          element: <QuoteRoute />,
        },
        {
          path: 'solicitudes',
          element: <SolicitudesRoute />,
        },
        {
          path: 'aprobaciones',
          element: (
            <ProtectedRoute requiredRole={2}>
              <div>Vista de Aprobaciones (Placeholder)</div>
            </ProtectedRoute>
          ),
        },
        {
          path: 'primas',
          element: (
            <ProtectedRoute requiredRole={1}>
              <PrimasRoute />
            </ProtectedRoute>
          ),
        },
      ],
    },

    // 3. Redirección raíz
    {
      path: '*',
      element: <Navigate to="/app/dashboard" replace />,
    },
  ]);
