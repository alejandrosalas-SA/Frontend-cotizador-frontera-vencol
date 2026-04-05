import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ListFilter, ClipboardCheck, Clock, FileText, ChevronRight, BarChart2 } from 'lucide-react';
import { useConteosSolicitudes } from '@/features/quote/hooks/useSolicitudes';
import { useMiniPanel } from '@/features/admin/hooks/useMiniPanel';
import { TopVehiculosChart } from '@/features/admin/components/charts/TopVehiculosChart';
import { RendimientoSucursalChart } from '@/features/admin/components/charts/RendimientoSucursalChart';
import { useAuthStore } from '@/stores/auth';
import transportationImg from '@/assets/imagen-principal-cotizacion-transporte-binacional.png';
import truckVideo from '@/assets/Animación_de_Camión_en_Vía.mp4';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DashboardRoute = () => {
  const navigate = useNavigate();
  const { data: conteos } = useConteosSolicitudes();
  const { data: miniPanel, isLoading: loadingPanel } = useMiniPanel();
  const { user } = useAuthStore();
  const puedeVerEstadisticas = user?.id_rol === 1 || user?.id_rol === 2;
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const stats = {
    total:      conteos?.total      ?? 0,
    generadas:  conteos?.generadas  ?? 0,
    borradores: conteos?.borradores ?? 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl h-[440px] group transition-all duration-500 hover:shadow-blue-900/10"
      >
        <div className="absolute inset-0 overflow-hidden">
          {/* Static Image (Base) */}
          <img
            src={transportationImg}
            alt="Transporte Binacional"
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              isHovered && isVideoReady ? "scale-110 opacity-0" : "scale-100 opacity-100"
            )}
          />

          {/* Cinematic Video Animation (Overlay) */}
          <video
            src={truckVideo}
            muted
            loop
            playsInline
            autoPlay
            onLoadedData={() => setIsVideoReady(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
              isHovered && isVideoReady ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 via-[#003366]/60 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-center px-10 md:px-16 space-y-6 max-w-2xl">
          <div className="space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-lg">
              Cotizador Binacional
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Impulsa el transporte <br />
              <span className="text-orange-400">binacional</span>
            </h1>
          </div>
          <p className="text-slate-200 text-lg leading-relaxed max-w-lg">
            Emite pólizas internacionales con agilidad y precisión para tus clientes. Gestiona cada solicitud de manera profesional.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              onClick={() => navigate('/app/cotizar')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-transform hover:-translate-y-1 active:scale-95"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nueva Cotización
            </Button>
            <Button
              onClick={() => navigate('/app/solicitudes')}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md h-12 px-8 rounded-xl transition-all"
            >
              <ListFilter className="mr-2 h-5 w-5" />
              Ver solicitudes
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "Total Solicitudes",
            value: stats.total,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            label_primary: "Mis Gestiones"
          },
          {
            label: "Cotizaciones Generadas",
            value: stats.generadas,
            icon: ClipboardCheck,
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
            label_primary: "Emitidas"
          },
          {
            label: "Borradores",
            value: stats.borradores,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100",
            label_primary: "En proceso"
          },
        ].map((stat, i) => (
          <div key={i} className={`p-8 rounded-3xl bg-white border ${stat.border} shadow-sm group hover:shadow-md transition-all duration-300 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 ${stat.bg} rounded-full opacity-50 group-hover:scale-110 transition-transform`} />
            <div className="relative flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label_primary}</span>
            </div>
            <div className="relative space-y-1">
              <h3 className="text-sm font-semibold text-slate-500">{stat.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</span>
                <span className="text-xs font-medium text-slate-400">solicitudes</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Mini Panel de Estadísticas */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col group transition-all hover:border-blue-100">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Mini Panel de Estadísticas</h3>
              <p className="text-sm text-slate-500 mt-0.5">Resumen de actividad binacional</p>
            </div>
          </div>
          {puedeVerEstadisticas && (
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 font-semibold" onClick={() => navigate('/app/estadisticas')}>
              Ver Panel Completo
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          )}
        </div>

        {loadingPanel ? (
          <div className="flex items-center justify-center p-16">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Top 10 Vehículos */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Top 10 Vehículos Cotizados</h4>
              {miniPanel && miniPanel.top_vehiculos.length > 0 ? (
                <TopVehiculosChart data={miniPanel.top_vehiculos} />
              ) : (
                <div className="flex items-center justify-center h-[320px] text-slate-400 text-sm">Sin datos disponibles</div>
              )}
            </div>

            {/* Rendimiento por Sucursal */}
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">Rendimiento por Sucursal</h4>
              {miniPanel && miniPanel.rendimiento_sucursales.length > 0 ? (
                <RendimientoSucursalChart data={miniPanel.rendimiento_sucursales} />
              ) : (
                <div className="flex items-center justify-center h-[280px] text-slate-400 text-sm">Sin datos disponibles</div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
