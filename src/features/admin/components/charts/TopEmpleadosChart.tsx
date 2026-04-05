import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { RendimientoEmpleado } from '@/types';

interface Props {
  data: RendimientoEmpleado[];
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as RendimientoEmpleado;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-1">{d.nombre_completo}</p>
      <p className="text-slate-600">Generadas: <span className="font-medium">{d.total_generadas}</span></p>
      <p className="text-slate-600">Borradores: <span className="font-medium">{d.total_borradores}</span></p>
      <p className="text-slate-600">Procesadas: <span className="font-medium">{d.total_procesadas}</span></p>
      <p className="text-slate-600">Tasa de cierre: <span className="font-medium">{d.tasa_cierre}%</span></p>
    </div>
  );
};

export const TopEmpleadosChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
      <XAxis
        dataKey="nombre_completo"
        tick={{ fontSize: 11 }}
        tickFormatter={(v: string) => v.split(' ')[0]}
      />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 12, paddingBottom: 4 }} verticalAlign="top" />
      <Bar dataKey="total_generadas" name="Generadas" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
      <Bar dataKey="total_borradores" name="Borradores" fill="#94a3b8" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
