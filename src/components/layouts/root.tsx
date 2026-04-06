import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { Home, FileText, PlusCircle, LogOut, Percent, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/Logos-Seguros-Altamira/logo-blanco-horizontal.svg';
import logoIcon from '@/assets/Logos-Seguros-Altamira/icono-cotizador.png';
import { getVersionActual } from '@/features/quote/api/maestros';

// Elementos de navegación según rol:
//   Rol 1 (Admin):      Inicio | Solicitudes | Cotizar | Estadísticas | Primas y Sumas
//   Rol 2 (Supervisor): Inicio | Solicitudes | Cotizar | Estadísticas
//   Rol 3 (Empleado):   Inicio | Solicitudes | Cotizar
const buildNavigation = (idRol: number) => {
  const base = [
    { name: 'Inicio',      href: '/app/dashboard',   icon: Home },
    { name: 'Solicitudes', href: '/app/solicitudes',  icon: FileText },
    { name: 'Cotizar',     href: '/app/cotizar',      icon: PlusCircle },
  ];

  if (idRol === 1 || idRol === 2) {
    base.push({ name: 'Estadísticas', href: '/app/estadisticas', icon: BarChart2 });
  }

  if (idRol === 1) {
    base.push({ name: 'Primas y Sumas', href: '/app/primas', icon: Percent });
  }

  return base;
};

const rolLabel = (idRol: number) => {
  if (idRol === 1) return 'Administrador';
  if (idRol === 2) return 'Supervisor';
  return 'Emisor';
};

export const AppRoot = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const { data: versionData } = useQuery({
    queryKey: ['version-actual'],
    queryFn: getVersionActual,
    staleTime: Infinity,
  });

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const navigation = buildNavigation(user?.id_rol ?? 3);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        'relative bg-[#003366] text-white flex flex-col shadow-xl z-20 transition-[width] duration-150 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}>
        {/* Botón flotante de colapso */}
        <button
          onClick={() => setCollapsed(v => !v)}
          title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-orange-300 border border-slate-200 shadow-md flex items-center justify-center text-[#003366] hover:bg-orange-200 transition-colors"
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft className="h-4 w-4" />
          }
        </button>
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 shrink-0 px-2">
          {collapsed
            ? <img src={logoIcon} alt="Logo" className="h-14 w-14 object-contain" />
            : <img src={logo} alt="Logo" className="h-14 w-auto mx-auto" />
          }
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden px-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'flex items-center py-3 text-sm font-medium rounded-lg transition-all',
                  collapsed ? 'justify-center px-2' : 'px-4',
                  isActive
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', !collapsed && 'mr-3')} />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer: usuario + logout */}
        <div className="border-t border-white/10 bg-black/10 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
              <div className="h-9 w-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold shrink-0">
                {user?.nombre?.[0] || 'U'}
              </div>
              <div className="text-sm overflow-hidden">
                <p className="font-medium truncate">{user?.nombre}</p>
                <p className="text-xs text-blue-100/60 capitalize">
                  {rolLabel(user?.id_rol ?? 3)}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => logout()}
            title={collapsed ? 'Salir' : undefined}
            className={cn(
              'flex items-center py-2 text-sm text-red-200 hover:text-white hover:bg-destructive/80 rounded-md transition-colors mx-auto',
              collapsed ? 'w-10 h-10 justify-center my-2' : 'w-[calc(100%-1rem)] px-4 mb-2'
            )}
          >
            <LogOut className={cn('h-4 w-4 shrink-0', !collapsed && 'mr-3')} />
            {!collapsed && 'Salir'}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between border-b z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Portal'}
          </h2>
          <div className="text-xs text-slate-400">
            {versionData?.nro_version ? `v${versionData.nro_version}` : 'v—'} &bull; Conectado
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
