import { useState, useCallback } from 'react';

const KPI_KEY = 'dashboard_kpi_order';
const CHART_KEY = 'dashboard_chart_order';
const KPI_HIDDEN_KEY = 'dashboard_kpi_hidden';
const CHART_HIDDEN_KEY = 'dashboard_chart_hidden';
const BADGE_HIDDEN_KEY = 'dashboard_badge_hidden';

export const DEFAULT_KPI_ORDER = [
  'emitidas',
  'borradores',
  'conversion',
  'ingresos',
  'ticket',
  'crecimiento',
] as const;

export const DEFAULT_CHART_ORDER = [
  'top-vehiculos',
  'tipo-transporte',
  'sucursales',
  'empleados',
] as const;

function readStorage<T extends string>(key: string, defaults: readonly T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [...defaults];
    const parsed: T[] = JSON.parse(raw);
    const valid = parsed.filter(id => (defaults as readonly string[]).includes(id));
    const missing = defaults.filter(id => !valid.includes(id));
    return [...valid, ...missing];
  } catch {
    return [...defaults];
  }
}

function readHiddenStorage(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export const useDashboardLayout = () => {
  const [kpiOrder, setKpiOrderState] = useState<string[]>(() =>
    readStorage(KPI_KEY, DEFAULT_KPI_ORDER)
  );
  const [chartOrder, setChartOrderState] = useState<string[]>(() =>
    readStorage(CHART_KEY, DEFAULT_CHART_ORDER)
  );
  const [hiddenKpis, setHiddenKpisState] = useState<string[]>(() =>
    readHiddenStorage(KPI_HIDDEN_KEY)
  );
  const [hiddenCharts, setHiddenChartsState] = useState<string[]>(() =>
    readHiddenStorage(CHART_HIDDEN_KEY)
  );
  const [hiddenBadges, setHiddenBadgesState] = useState<string[]>(() =>
    readHiddenStorage(BADGE_HIDDEN_KEY)
  );

  const setKpiOrder = useCallback((order: string[]) => {
    setKpiOrderState(order);
    localStorage.setItem(KPI_KEY, JSON.stringify(order));
  }, []);

  const setChartOrder = useCallback((order: string[]) => {
    setChartOrderState(order);
    localStorage.setItem(CHART_KEY, JSON.stringify(order));
  }, []);

  const toggleKpiVisibility = useCallback((id: string) => {
    setHiddenKpisState(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(KPI_HIDDEN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleChartVisibility = useCallback((id: string) => {
    setHiddenChartsState(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(CHART_HIDDEN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleBadgeVisibility = useCallback((id: string) => {
    setHiddenBadgesState(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(BADGE_HIDDEN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetLayout = useCallback(() => {
    localStorage.removeItem(KPI_KEY);
    localStorage.removeItem(CHART_KEY);
    localStorage.removeItem(KPI_HIDDEN_KEY);
    localStorage.removeItem(CHART_HIDDEN_KEY);
    localStorage.removeItem(BADGE_HIDDEN_KEY);
    setKpiOrderState([...DEFAULT_KPI_ORDER]);
    setChartOrderState([...DEFAULT_CHART_ORDER]);
    setHiddenKpisState([]);
    setHiddenChartsState([]);
    setHiddenBadgesState([]);
  }, []);

  return {
    kpiOrder,
    chartOrder,
    setKpiOrder,
    setChartOrder,
    resetLayout,
    hiddenKpis,
    hiddenCharts,
    hiddenBadges,
    toggleKpiVisibility,
    toggleChartVisibility,
    toggleBadgeVisibility,
  };
};
