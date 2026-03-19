import { useState } from 'react';
import { Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EditValueModal } from './EditValueModal';
import { useTarifas, useUpdateTarifa } from '../hooks/useTarifas';
import { useToast } from '@/lib/toast';
import type { Tarifa } from '@/types';

interface SelectedTarifa {
  id: number;
  prima: number;
  label: string;
}

export const TarifasTab = () => {
  const { data: tarifas = [], isLoading } = useTarifas();
  const updateMutation = useUpdateTarifa();
  const { success: toastSuccess, error: toastError } = useToast();
  const [selected, setSelected] = useState<SelectedTarifa | null>(null);

  // Agrupa las tarifas por tipo_cobertura
  const groups = tarifas.reduce<Record<string, Tarifa[]>>((acc, t) => {
    const key = t.tipo_cobertura;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  // Obtiene los duración únicos para generar columnas
  const getDuraciones = (rows: Tarifa[]) =>
    [...new Set(rows.map((r) => r.duracion_viaje_nombre))];

  // Obtiene los transportes únicos para generar filas
  const getTransportes = (rows: Tarifa[]) =>
    [...new Set(rows.map((r) => r.tipo_transporte_nombre || `Tipo ${r.tipo_transporte}`))];

  const handleEdit = (tarifa: Tarifa) => {
    const transporteLabel = tarifa.tipo_transporte_nombre || `Tipo ${tarifa.tipo_transporte}`;
    setSelected({
      id: tarifa.id,
      prima: tarifa.prima,
      label: `${transporteLabel} — ${tarifa.duracion_viaje_nombre}`,
    });
  };

  const handleSubmit = async (value: number) => {
    if (!selected) return;
    try {
      await updateMutation.mutateAsync({ id: selected.id, payload: { prima: value } });
      toastSuccess('Prima actualizada correctamente');
      setSelected(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la prima';
      toastError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        Cargando tarifas...
      </div>
    );
  }

  if (!tarifas.length) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        No se encontraron tarifas registradas.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {Object.entries(groups).map(([tipoCob, rows]) => {
          const duraciones = getDuraciones(rows);
          const transportes = getTransportes(rows);

          // Separa las filas con tasación especial de las normales
          const rowsNormales = rows.filter((r) => !r.id_tasacion_especial);
          const rowsEspeciales = rows.filter((r) => r.id_tasacion_especial);

          return (
            <div key={tipoCob} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">
                  Cobertura: {tipoCob}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="w-48 font-semibold">Tipo de Transporte</TableHead>
                      {duraciones.map((d) => (
                        <TableHead key={d} className="text-center font-semibold text-xs">
                          {d}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transportes.map((transporte) => {
                      const rowData = rowsNormales.filter(
                        (r) =>
                          (r.tipo_transporte_nombre || `Tipo ${r.tipo_transporte}`) === transporte
                      );
                      if (!rowData.length) return null;
                      return (
                        <TableRow key={transporte}>
                          <TableCell className="font-medium text-slate-700 text-sm">
                            {transporte}
                          </TableCell>
                          {duraciones.map((duracion) => {
                            const tarifa = rowData.find(
                              (r) => r.duracion_viaje_nombre === duracion
                            );
                            if (!tarifa) {
                              return (
                                <TableCell key={duracion} className="text-center text-slate-300">
                                  —
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell key={duracion} className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <span className="font-mono text-sm">
                                    {Number(tarifa.prima).toFixed(3)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-[#003366]"
                                    onClick={() => handleEdit(tarifa)}
                                    title="Editar prima"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}

                    {/* Filas de tasación especial */}
                    {rowsEspeciales.map((tarifa) => (
                      <TableRow key={tarifa.id} className="bg-amber-50/30">
                        <TableCell className="font-medium text-slate-700 text-sm">
                          <div className="flex items-center gap-2">
                            {tarifa.tasacion_especial_nombre || `Especial ${tarifa.id_tasacion_especial}`}
                            <Badge variant="secondary" className="text-xs">Especial</Badge>
                          </div>
                        </TableCell>
                        <TableCell
                          colSpan={duraciones.length}
                          className="text-center"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-mono text-sm">
                              {Number(tarifa.prima).toFixed(3)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400 hover:text-[#003366]"
                              onClick={() => handleEdit(tarifa)}
                              title="Editar prima"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <EditValueModal
          open={!!selected}
          onOpenChange={(v) => !v && setSelected(null)}
          title="Editar Prima"
          label={selected.label}
          currentValue={selected.prima}
          isLoading={updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};