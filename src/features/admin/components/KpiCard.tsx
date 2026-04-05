import type { ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface BadgeProps {
  label: string;
  type: 'up' | 'down' | 'neutral';
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  badge?: BadgeProps;
  dragHandle?: ReactNode;
  onHide?: () => void;
  badgeVisible?: boolean;
  onToggleBadge?: () => void;
}

export const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  badge,
  dragHandle,
  onHide,
  badgeVisible = true,
  onToggleBadge,
}: KpiCardProps) => {
  const badgeClass =
    badge?.type === 'up'
      ? 'bg-green-100 text-green-700'
      : badge?.type === 'down'
        ? 'bg-red-100 text-red-700'
        : 'bg-slate-100 text-slate-600';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="text-sm font-medium text-slate-500">{title}</span>
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
          {dragHandle}
          <span className="text-slate-400">{icon}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold text-slate-800">{value}</div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {badge && (
          <div className="mt-3 flex items-center justify-center gap-1">
            {badgeVisible ? (
              <>
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass} flex-1 text-center`}
                >
                  {badge.label}
                </span>
                {onToggleBadge && (
                  <button
                    onClick={onToggleBadge}
                    className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded"
                    title="Ocultar badge"
                  >
                    <EyeOff className="h-3 w-3" />
                  </button>
                )}
              </>
            ) : (
              onToggleBadge && (
                <button
                  onClick={onToggleBadge}
                  className="text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded mx-auto"
                  title="Mostrar badge"
                >
                  <Eye className="h-3 w-3" />
                </button>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
