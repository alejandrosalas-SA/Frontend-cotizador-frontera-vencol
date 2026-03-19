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
import { EditValueModal } from './EditValueModal';
import { useSumasAseguradas, useUpdateSumaAsegurada, useDefinicionTerminos } from '../hooks/useSumasAseguradas';
import { useToast } from '@/lib/toast';
import type { SumaAsegurada } from '@/types';

interface SelectedSuma {
  id: number;
  valor: number;
  label: string;
}

const TIPO_EXCESO_LABEL: Record<number, string> = {
  1: 'Alternativa A',
  2: 'Alternativa B',
  3: 'Alternativa C',
};

// Fila individual editable
const SumaRow = ({
  suma,
  terminosMap,
  onEdit,
}: {
  suma: SumaAsegurada;
  terminosMap: Record<number, string>;
  onEdit: (suma: SumaAsegurada) => void;
}) => (
  <TableRow key={suma.id}>
    <TableCell className="text-slate-500 text-sm text-left">
      {terminosMap[suma.id_def_termino] ?? `Término ${suma.id_def_termino}`}
    </TableCell>
    <TableCell className="text-right font-mono text-sm font-semibold">
      {Number(suma.valor).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </TableCell>
    <TableCell className="text-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-slate-400 hover:text-[#003366]"
        onClick={() => onEdit(suma)}
        title="Editar valor"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </TableCell>
  </TableRow>
);

// Tabla con sub-grupos TERCERO / PASAJERO (para BASICO)
const SumaTableGrouped = ({
  title,
  rows,
  terminosMap,
  onEdit,
}: {
  title: string;
  rows: SumaAsegurada[];
  terminosMap: Record<number, string>;
  onEdit: (suma: SumaAsegurada) => void;
}) => {
  const terceros = rows.filter((r) => r.tipo_beneficiario === 'TERCERO');
  const pasajeros = rows.filter((r) => r.tipo_beneficiario === 'PASAJERO');

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden w-full">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">
          {title}
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-left">Término</TableHead>
            <TableHead className="text-right font-semibold">Valor Asegurado</TableHead>
            <TableHead className="w-20 text-center font-semibold">Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-blue-50/60">
            <TableCell colSpan={3} className="py-1 px-4 text-xs font-bold text-[#003366] uppercase tracking-wider">
              Daños a Terceros no Transportados
            </TableCell>
          </TableRow>
          {terceros.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-slate-400 text-sm py-4">Sin registros</TableCell>
            </TableRow>
          ) : (
            terceros.map((suma) => (
              <SumaRow key={suma.id} suma={suma} terminosMap={terminosMap} onEdit={onEdit} />
            ))
          )}
          <TableRow className="bg-blue-50/60">
            <TableCell colSpan={3} className="py-1 px-4 text-xs font-bold text-[#003366] uppercase tracking-wider">
              Daños a Pasajeros
            </TableCell>
          </TableRow>
          {pasajeros.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-slate-400 text-sm py-4">Sin registros</TableCell>
            </TableRow>
          ) : (
            pasajeros.map((suma) => (
              <SumaRow key={suma.id} suma={suma} terminosMap={terminosMap} onEdit={onEdit} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Tabla Exceso: agrupa primero por Alternativa (tipo_exceso) y dentro por TERCERO/PASAJERO
const SumaTableExceso = ({
  rows,
  terminosMap,
  onEdit,
}: {
  rows: SumaAsegurada[];
  terminosMap: Record<number, string>;
  onEdit: (suma: SumaAsegurada) => void;
}) => {
  const tiposExceso = [1, 2, 3];

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden w-full">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">
          Cobertura Exceso
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-left">Término</TableHead>
            <TableHead className="text-right font-semibold">Valor Asegurado</TableHead>
            <TableHead className="w-20 text-center font-semibold">Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiposExceso.map((tipoExceso) => {
            const grupoAlternativa = rows.filter((r) => r.tipo_exceso === tipoExceso);
            const terceros = grupoAlternativa.filter((r) => r.tipo_beneficiario === 'TERCERO');
            const pasajeros = grupoAlternativa.filter((r) => r.tipo_beneficiario === 'PASAJERO');

            return (
              <>
                {/* Subtítulo Alternativa */}
                <TableRow key={`alt-${tipoExceso}`} className="bg-[#003366]/10">
                  <TableCell colSpan={3} className="py-2 px-4 text-sm font-bold text-[#003366] uppercase tracking-wide">
                    {TIPO_EXCESO_LABEL[tipoExceso]}
                  </TableCell>
                </TableRow>

                {/* Sub-grupo TERCERO */}
                <TableRow key={`alt-${tipoExceso}-tercero`} className="bg-blue-50/60">
                  <TableCell colSpan={3} className="py-1 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Daños a Terceros no Transportados
                  </TableCell>
                </TableRow>
                {terceros.map((suma) => (
                  <SumaRow key={suma.id} suma={suma} terminosMap={terminosMap} onEdit={onEdit} />
                ))}

                {/* Sub-grupo PASAJERO */}
                <TableRow key={`alt-${tipoExceso}-pasajero`} className="bg-blue-50/60">
                  <TableCell colSpan={3} className="py-1 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Daños a Pasajeros
                  </TableCell>
                </TableRow>
                {pasajeros.map((suma) => (
                  <SumaRow key={suma.id} suma={suma} terminosMap={terminosMap} onEdit={onEdit} />
                ))}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

// Tabla plana (para OPCIONAL)
const SumaTableFlat = ({
  title,
  rows,
  terminosMap,
  onEdit,
}: {
  title: string;
  rows: SumaAsegurada[];
  terminosMap: Record<number, string>;
  onEdit: (suma: SumaAsegurada) => void;
}) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden w-3/4">
    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
      <h3 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">
        {title}
      </h3>
    </div>
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/50">
          <TableHead className="font-semibold text-left">Término</TableHead>
          <TableHead className="text-right font-semibold">Valor Asegurado</TableHead>
          <TableHead className="w-20 text-center font-semibold">Editar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-slate-400 text-sm py-8">
              Sin registros
            </TableCell>
          </TableRow>
        ) : (
          rows.map((suma) => (
            <TableRow key={suma.id}>
              <TableCell className="text-slate-500 text-sm text-left">
                {terminosMap[suma.id_def_termino] ?? `Término ${suma.id_def_termino}`}
              </TableCell>
              <TableCell className="text-right font-mono text-sm font-semibold">
                {Number(suma.valor).toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-400 hover:text-[#003366]"
                  onClick={() => onEdit(suma)}
                  title="Editar valor"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>
);

export const SumasAseguradasTab = () => {
  const { data, isLoading } = useSumasAseguradas();
  const { data: terminos } = useDefinicionTerminos();
  const updateMutation = useUpdateSumaAsegurada();
  const { success: toastSuccess, error: toastError } = useToast();
  const [selected, setSelected] = useState<SelectedSuma | null>(null);

  const terminosMap: Record<number, string> = Object.fromEntries(
    (terminos ?? []).map((t) => [t.id, t.etiqueta])
  );

  const handleEdit = (suma: SumaAsegurada) => {
    const exceso = suma.tipo_exceso
      ? ` — ${TIPO_EXCESO_LABEL[suma.tipo_exceso] ?? `Tipo ${suma.tipo_exceso}`}`
      : '';
    setSelected({
      id: suma.id,
      valor: suma.valor,
      label: `${suma.tipo_cobertura}${exceso} — ${terminosMap[suma.id_def_termino] ?? `Término ${suma.id_def_termino}`}`,
    });
  };

  const handleSubmit = async (value: number) => {
    if (!selected) return;
    try {
      await updateMutation.mutateAsync({ id: selected.id, payload: { valor: value } });
      toastSuccess('Suma asegurada actualizada correctamente');
      setSelected(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar el valor';
      toastError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm">
        Cargando sumas aseguradas...
      </div>
    );
  }

  const basico = data?.basico ?? [];
  const exceso = data?.exceso ?? [];
  const opcional = data?.opcional ?? [];

  return (
    <>
      <div className="space-y-6 flex flex-col items-center">
        <SumaTableGrouped
          title="Cobertura Básica"
          rows={basico}
          terminosMap={terminosMap}
          onEdit={handleEdit}
        />
        <SumaTableExceso
          rows={exceso}
          terminosMap={terminosMap}
          onEdit={handleEdit}
        />
        <SumaTableFlat
          title="Cobertura Opcional"
          rows={opcional}
          terminosMap={terminosMap}
          onEdit={handleEdit}
        />
      </div>

      {selected && (
        <EditValueModal
          open={!!selected}
          onOpenChange={(v) => !v && setSelected(null)}
          title="Editar Suma Asegurada"
          label={selected.label}
          currentValue={selected.valor}
          isLoading={updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
