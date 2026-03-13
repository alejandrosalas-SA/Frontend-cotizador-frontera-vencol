import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ListFilter, ClipboardCheck, Clock, FileText, ChevronRight } from 'lucide-react';
import { useSolicitudesList } from '@/features/quote/hooks/useSolicitudes';
import transportationImg from '@/assets/imagen-principal-cotizacion-transporte-binacional.png';
import truckVideo from '@/assets/Animación_de_Camión_en_Vía.mp4';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const DashboardRoute = () => {
  const navigate = useNavigate();
  const { data: solicitudes } = useSolicitudesList();
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const stats = {
    total: solicitudes?.length || 0,
    generadas: solicitudes?.filter(s => s.status === 1).length || 0,
    borradores: solicitudes?.filter(s => s.status === 0).length || 0,
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

      {/* Recent Activity Placeholder / Power BI Placeholder */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[400px] flex flex-col group transition-all hover:border-blue-100">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Panel de Estadísticas Avanzadas</h3>
            <p className="text-sm text-slate-500 mt-1">Monitoreo de actividad binacional en tiempo real</p>
          </div>
          <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 font-semibold" onClick={() => navigate('/app/solicitudes')}>
            Ver Detalles
            <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-10 h-10 bg-blue-200 rounded-full" />
          </div>
          <p className="text-slate-400 font-medium max-w-sm">
            Integración automática con Power BI para reporte de cotizaciones y flujo de carga.
          </p>
        </div>
      </section>
    </div>
  );
};
