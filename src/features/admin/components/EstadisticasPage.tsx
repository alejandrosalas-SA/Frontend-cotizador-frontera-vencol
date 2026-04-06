import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BarChart2, DollarSign, TrendingUp, FileText,
  CheckCircle, Percent, Tag, GripVertical, RotateCcw, Eye, EyeOff, Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEstadisticas } from '../hooks/useEstadisticas';
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { KpiCard } from './KpiCard';
import { TopVehiculosChart } from './charts/TopVehiculosChart';
import { TipoTransporteChart } from './charts/TipoTransporteChart';
import { RendimientoSucursalChart } from './charts/RendimientoSucursalChart';
import { TopEmpleadosChart } from './charts/TopEmpleadosChart';
import { useSucursalesDisponibles } from '@/features/quote/hooks/useSucursalesDisponibles';
import { useAuthStore } from '@/stores/auth';
import type { DashboardEstadisticas } from '@/types';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const kpiLabels: Record<string, string> = {
  emitidas:   'Solicitudes emitidas',
  borradores: 'Total borradores',
  conversion: 'Ventas concretadas',
  ingresos:   'Ingresos del mes',
  ticket:     'Prima promedio',
  crecimiento:'Crecimiento mensual',
};

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

interface SortableCardProps {
  id: string;
  children: (handleProps: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
}

const SortableCard = ({ id, children }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-40 h-full' : 'h-full'}
    >
      {children({ ...listeners, ...attributes })}
    </div>
  );
};

// ─── KPI widget ───────────────────────────────────────────────────────────────

interface KpiWidgetProps {
  id: string;
  data: DashboardEstadisticas;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  onHide?: () => void;
  badgeVisible?: boolean;
  onToggleBadge?: () => void;
}

const KpiWidget = ({ id, data, dragHandleProps, onHide, badgeVisible = true, onToggleBadge }: KpiWidgetProps) => {
  const { kpis } = data;
  const growthType = kpis.porcentaje_crecimiento >= 0 ? 'up' : 'down';
  const growthLabel = `${kpis.porcentaje_crecimiento >= 0 ? '▲' : '▼'} ${Math.abs(kpis.porcentaje_crecimiento).toFixed(2)}% vs mes anterior`;

  const handle = dragHandleProps ? (
    <span
      {...dragHandleProps}
      className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors touch-none"
      title="Arrastrar"
    >
      <GripVertical className="h-4 w-4" />
    </span>
  ) : undefined;

  const cards: Record<string, React.ReactNode> = {
    emitidas: (
      <KpiCard title="Solicitudes emitidas" value={String(kpis.total_emitidas)}
        subtitle={`${kpis.total_borradores} en borrador`}
        icon={<CheckCircle className="h-5 w-5" />} dragHandle={handle}
        onHide={onHide} />
    ),
    borradores: (
      <KpiCard title="Total borradores" value={String(kpis.total_borradores)}
        icon={<FileText className="h-5 w-5" />} dragHandle={handle}
        onHide={onHide} />
    ),
    conversion: (
      <KpiCard title="Porcentaje de ventas concretadas" value={`${kpis.tasa_conversion.toFixed(2)}%`}
        subtitle="Cotizaciones que pasaron de borrador a solicitud"
        icon={<TrendingUp className="h-5 w-5" />}
        badge={{ label: kpis.tasa_conversion >= 70 ? 'Buena' : 'Mejorable', type: kpis.tasa_conversion >= 70 ? 'up' : 'down' }}
        dragHandle={handle} onHide={onHide}
        badgeVisible={badgeVisible} onToggleBadge={onToggleBadge} />
    ),
    ingresos: (
      <KpiCard title="Ingresos del mes" value={`$ ${fmt(kpis.ingresos_mes_actual)}`}
        subtitle={`Mes anterior: $ ${fmt(kpis.ingresos_mes_anterior)}`}
        icon={<DollarSign className="h-5 w-5" />}
        badge={{ label: growthLabel, type: growthType }} dragHandle={handle}
        onHide={onHide} badgeVisible={badgeVisible} onToggleBadge={onToggleBadge} />
    ),
    ticket: (
      <KpiCard title="Prima promedio por solicitud" value={`$ ${fmt(kpis.ticket_promedio)}`}
        subtitle="Prima promedio de las solicitudes emitidas"
        icon={<Tag className="h-5 w-5" />} dragHandle={handle}
        onHide={onHide} />
    ),
    crecimiento: (
      <KpiCard title="Crecimiento mensual" value={`${kpis.porcentaje_crecimiento.toFixed(2)}%`}
        icon={<Percent className="h-5 w-5" />}
        badge={{ label: growthLabel, type: growthType }} dragHandle={handle}
        onHide={onHide} badgeVisible={badgeVisible} onToggleBadge={onToggleBadge} />
    ),
  };

  return <>{cards[id]}</>;
};

// ─── Chart widget ─────────────────────────────────────────────────────────────

interface ChartWidgetProps {
  id: string;
  data: DashboardEstadisticas;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  onHide?: () => void;
}

const chartTitles: Record<string, string> = {
  'top-vehiculos':    'Top 10 Vehículos Cotizados',
  'tipo-transporte':  'Distribución por Tipo de Transporte',
  'sucursales':       'Rendimiento por Sucursal',
  'empleados':        'Top de Intermediarios',
};

const ChartWidget = ({ id, data, dragHandleProps, onHide }: ChartWidgetProps) => {
  const content: Record<string, React.ReactNode> = {
    'top-vehiculos':   <TopVehiculosChart data={data.top_vehiculos} />,
    'tipo-transporte': <TipoTransporteChart data={data.distribucion_transporte} />,
    'sucursales':      <RendimientoSucursalChart data={data.rendimiento_sucursales} />,
    'empleados':       <TopEmpleadosChart data={data.rendimiento_empleados} />,
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">
          {chartTitles[id]}
        </CardTitle>
        <div className="flex items-center gap-1">
          {onHide && (
            <button
              onClick={onHide}
              className="text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded"
              title="Ocultar"
            >
              <EyeOff className="h-3.5 w-3.5" />
            </button>
          )}
          {dragHandleProps && (
            <span
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors touch-none"
              title="Arrastrar"
            >
              <GripVertical className="h-4 w-4" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>{content[id]}</CardContent>
    </Card>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

export const EstadisticasPage = () => {
  const { user } = useAuthStore();
  const rol = user?.id_rol ?? 3;

  // Selector de sucursal (visible para admin y supervisor)
  const [idSucursalSeleccionada, setIdSucursalSeleccionada] = useState<number | null>(null);
  const { sucursales, isLoading: loadingSucursales } = useSucursalesDisponibles();

  const { data, isLoading } = useEstadisticas(idSucursalSeleccionada);

  const {
    kpiOrder, chartOrder, setKpiOrder, setChartOrder, resetLayout,
    hiddenKpis, hiddenCharts, hiddenBadges,
    toggleKpiVisibility, toggleChartVisibility, toggleBadgeVisibility,
  } = useDashboardLayout();
  const [activeKpiId, setActiveKpiId]     = useState<string | null>(null);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const visibleKpis   = kpiOrder.filter(id => !hiddenKpis.includes(id));
  const visibleCharts = chartOrder.filter(id => !hiddenCharts.includes(id));
  const hasHidden     = hiddenKpis.length > 0 || hiddenCharts.length > 0;

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-80 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const placeholderSucursal = rol === 1 ? 'Todas las sucursales' : 'Todas mis sucursales';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-7 w-7 text-[#003366]" />
          <h1 className="text-2xl font-bold text-[#003366]">Estadísticas</h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector de sucursal: visible para admin (rol 1) y supervisor (rol 2) */}
          {(rol === 1 || rol === 2) && sucursales.length > 0 && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
              <Select
                value={idSucursalSeleccionada != null ? String(idSucursalSeleccionada) : 'todas'}
                onValueChange={(val) =>
                  setIdSucursalSeleccionada(val === 'todas' ? null : parseInt(val))
                }
              >
                <SelectTrigger className="w-[200px] bg-white border-slate-200 text-sm">
                  <SelectValue placeholder={placeholderSucursal} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">{placeholderSucursal}</SelectItem>
                  {sucursales.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cargando sucursales */}
          {(rol === 1 || rol === 2) && loadingSucursales && (
            <div className="w-[200px] h-9 bg-slate-200 rounded animate-pulse" />
          )}

          {/* Menú de visibilidad */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-slate-500">
                {hasHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                Visibilidad
                {hasHidden && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600">
                    {hiddenKpis.length + hiddenCharts.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                KPIs
              </DropdownMenuLabel>
              {Object.entries(kpiLabels).map(([id, label]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={!hiddenKpis.includes(id)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => toggleKpiVisibility(id)}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Gráficos
              </DropdownMenuLabel>
              {Object.entries(chartTitles).map(([id, label]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={!hiddenCharts.includes(id)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => toggleChartVisibility(id)}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={resetLayout}
            className="flex items-center gap-2 text-slate-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restablecer
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }: DragStartEvent) => setActiveKpiId(active.id as string)}
        onDragEnd={({ active, over }: DragEndEvent) => {
          setActiveKpiId(null);
          if (over && active.id !== over.id) {
            const oi = kpiOrder.indexOf(active.id as string);
            const ni = kpiOrder.indexOf(over.id as string);
            setKpiOrder(arrayMove(kpiOrder, oi, ni));
          }
        }}
      >
        <SortableContext items={visibleKpis} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleKpis.map((id) => (
              <SortableCard key={id} id={id}>
                {(hp) => (
                  <KpiWidget
                    id={id}
                    data={data}
                    dragHandleProps={hp}
                    onHide={() => toggleKpiVisibility(id)}
                    badgeVisible={!hiddenBadges.includes(id)}
                    onToggleBadge={() => toggleBadgeVisibility(id)}
                  />
                )}
              </SortableCard>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeKpiId && (
            <div className="opacity-90 rotate-1 shadow-2xl">
              <KpiWidget id={activeKpiId} data={data} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Gráficos */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }: DragStartEvent) => setActiveChartId(active.id as string)}
        onDragEnd={({ active, over }: DragEndEvent) => {
          setActiveChartId(null);
          if (over && active.id !== over.id) {
            const oi = chartOrder.indexOf(active.id as string);
            const ni = chartOrder.indexOf(over.id as string);
            setChartOrder(arrayMove(chartOrder, oi, ni));
          }
        }}
      >
        <SortableContext items={visibleCharts} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visibleCharts.map((id) => (
              <SortableCard key={id} id={id}>
                {(hp) => (
                  <ChartWidget
                    id={id}
                    data={data}
                    dragHandleProps={hp}
                    onHide={() => toggleChartVisibility(id)}
                  />
                )}
              </SortableCard>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeChartId && (
            <div className="opacity-90 rotate-1 shadow-2xl">
              <ChartWidget id={activeChartId} data={data} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
