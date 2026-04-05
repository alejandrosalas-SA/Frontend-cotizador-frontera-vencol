import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { TopVehiculo } from '@/types';

interface Props {
  data: TopVehiculo[];
}

export const TopVehiculosChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={320}>
    <BarChart layout="vertical" data={data} margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
      <XAxis type="number" tick={{ fontSize: 12 }} />
      <YAxis
        type="category"
        dataKey="marca_modelo"
        width={130}
        tick={{ fontSize: 12 }}
      />
      <Tooltip
        formatter={(value: number) => [value, 'Cotizaciones']}
        contentStyle={{ fontSize: 12, borderRadius: 8 }}
      />
      <Bar
        dataKey="cantidad_cotizaciones"
        fill="#1d4ed8"
        radius={[0, 4, 4, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
);
