import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { Home, FileText, PlusCircle, CheckSquare, LogOut, Percent } from 'lucide-react';
import { cn } from '@/lib/utils'; // Asegúrate de tener utils.ts de shadcn
import logo from '@/assets/Logos-Seguros-Altamira/logo-blanco-horizontal.svg';

export const AppRoot = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Protección de Ruta: Si no hay usuario, mandar al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: Home },
    { name: 'Solicitudes', href: '/app/solicitudes', icon: FileText },
    { name: 'Cotizar', href: '/app/cotizar', icon: PlusCircle },
    // Solo mostramos Aprobaciones si es rol 2 (Supervisor)
    ...(user?.id_rol === 2 ? [{ name: 'Aprobaciones', href: '/app/aprobaciones', icon: CheckSquare }] : []),
    // Solo mostramos Primas y Sumas si es rol 1 (Administrador)
    ...(user?.id_rol === 1 ? [{ name: 'Primas y Sumas', href: '/app/primas', icon: Percent }] : []),
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl z-20">
        <div className="p-1 text-xl font-bold border-b border-secondary flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-14 w-auto mx-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all",
                  isActive
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold">
              {user?.nombre?.[0] || 'U'}
            </div>
            <div className="text-sm overflow-hidden">
              <p className="font-medium truncate">{user?.nombre}</p>
              <p className="text-xs text-blue-100/60 capitalize">
                {user?.id_rol === 1 ? 'Administrador' : user?.id_rol === 2 ? 'Supervisor' : 'Emisor'}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center w-full px-4 py-2 text-sm text-red-200 hover:text-white hover:bg-destructive/80 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Salir
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between border-b z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Portal'}
          </h2>
          <div className="text-xs text-slate-400">v1.0.0 &bull; Conectado</div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};