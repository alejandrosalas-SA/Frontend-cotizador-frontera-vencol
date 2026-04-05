import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { DistribucionTransporte } from '@/types';

const COLORS = [
  'hsl(221 83% 53%)',
  'hsl(212 95% 68%)',
  'hsl(199 89% 48%)',
  'hsl(186 94% 41%)',
  'hsl(28 100% 55%)',
];

interface Props {
  data: DistribucionTransporte[];
}

const renderCenterLabel = (total: number) =>
  ({ viewBox }: { viewBox?: { cx?: number; cy?: number } }) => {
    const cx = viewBox?.cx ?? 0;
    const cy = viewBox?.cy ?? 0;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan x={cx} dy="-0.4em" fontSize={20} fontWeight={700} fill="#1e293b">
          {total}
        </tspan>
        <tspan x={cx} dy="1.4em" fontSize={11} fill="#64748b">
          total
        </tspan>
      </text>
    );
  };

export const TipoTransporteChart = ({ data }: Props) => {
  const total = data.reduce((acc, d) => acc + d.cantidad, 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="cantidad"
          nameKey="tipo_transporte_nombre"
          innerRadius="50%"
          outerRadius="80%"
          label={false}
          labelLine={false}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
          {/* Label central via recharts label prop workaround */}
        </Pie>
        <text
          x="50%"
          y="35%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={15}
          fontWeight={700}
          fill="#1e293b"
        >
          {total}
        </text>
        <text
          x="50%"
          y="40%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fill="#64748b"
        >
          total
        </text>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value: string) =>
            value
          }
          wrapperStyle={{ fontSize: 12.5 }}
          verticalAlign="bottom"
          align="center"
          layout="vertical"

        />
      </PieChart>
    </ResponsiveContainer>
  );

  // Unused but satisfies TS for the renderCenterLabel helper
  void renderCenterLabel(total);
};
