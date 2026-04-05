import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RendimientoSucursal } from '@/types';

interface Props {
  data: RendimientoSucursal[];
}

export const RendimientoSucursalChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart
      data={data}
      barCategoryGap="30%"
      barGap={4}
      margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
    >
      <XAxis dataKey="sucursal" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
      <Legend wrapperStyle={{ fontSize: 12, paddingBottom: 4 }} verticalAlign="top" />
      <Bar dataKey="solicitudes_generadas" name="Generadas" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
      <Bar dataKey="borradores" name="Borradores" fill="#94a3b8" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
