import { useMemo } from 'react';
import { useQuoteStore } from '../store/quoteStore';
import { useSumasAseguradas } from '../hooks/useMaestros';

export const CoverageForm = () => {
    const { data, updateData, cotizacionFinal } = useQuoteStore();
    const vehiculo = data.vehiculo;
    const { data: sumasAseguradas, isLoading: isLoadingSumas } = useSumasAseguradas(vehiculo?.tipo_exceso);

    // Helper para buscar valor
    const getSuma = useMemo(() => {
        return (tipo: 'basico' | 'exceso' | 'opcional', id_def_termino: number) => {
            if (!sumasAseguradas) return undefined;
            const coleccion = sumasAseguradas[tipo];
            const item = coleccion?.find(x => x.id_def_termino === id_def_termino);
            return item?.valor;
        };
    }, [sumasAseguradas]);

    // Formateador de moneda
    const formatCurrency = (val?: number) => {
        if (val === undefined || val === null) return '$ 0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(val).replace('$', '$ ');
    };

    const TableHeader = ({ title }: { title: string }) => (
        <div className="bg-[#003366] text-white py-2 px-4 font-bold text-center mb-0 mt-4">
            {title}
        </div>
    );

    const Cell = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
        <div className={`p-2 border border-slate-300 text-sm ${className}`}>
            {children || <>&nbsp;</>}
        </div>
    );

    const LabelCell = ({ children }: { children?: React.ReactNode }) => (
        <Cell className="font-semibold text-slate-700 bg-slate-50">{children}</Cell>
    );

    const condiciones = data.condiciones || '';
    const observaciones = data.observaciones || '';

    // Loading state for sumas aseguradas
    if (isLoadingSumas) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-[#003366]">
                <svg className="animate-spin h-10 w-10 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="text-xl font-bold animate-pulse">Calculando cotización...</div>
                <div className="text-sm text-slate-500 mt-2">Por favor espere mientras cargamos los valores y generamos las coberturas y primas.</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 px-2">
            <div>
                <TableHeader title="Cobertura Básica" />
                <div className="grid grid-cols-4 bg-white">
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Definición de Términos</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Daños a terceros no transportados</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Daños a Pasajeros</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Prima según duración del viaje</div>

                    <LabelCell>Muerte y/o Daños Personales (DP)</LabelCell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('basico', 1))}</Cell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('basico', 4))}</Cell>
                    <Cell className="row-span-4 flex items-center justify-center font-bold text-lg text-[#003366]">
                        {formatCurrency(cotizacionFinal?.prima_basica)}
                    </Cell>

                    <LabelCell>Daños Materiales (DM)</LabelCell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('basico', 2))}</Cell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('basico', 5))}</Cell>

                    <LabelCell>Varias Reclamaciones Relacionadas con un mismo Evento (LIM)</LabelCell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('basico', 3))}</Cell>
                    <div className="grid grid-cols-2">
                        <div className="p-1 border-r border-slate-300 text-xs">(DP)</div>
                        <div className="p-1 text-right font-mono text-xs">{formatCurrency(getSuma('basico', 6))}</div>
                        <div className="p-1 border-t border-r border-slate-300 text-xs">(DM)</div>
                        <div className="p-1 border-t text-right font-mono text-xs">{formatCurrency(getSuma('basico', 7))}</div>
                    </div>
                </div>
            </div>

            <div>
                <TableHeader title="Cobertura Exceso" />
                <div className="grid grid-cols-4 bg-white">
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Definición de Términos</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Daños a terceros no transportados</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Daños a Pasajeros</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Prima según duración del viaje</div>

                    <LabelCell>Muerte y/o Daños Personales (DP)</LabelCell>
                    <Cell className="text-right font-mono">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 1)) : '-'}</Cell>
                    <Cell className="text-right font-mono">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 4)) : '-'}</Cell>
                    <Cell className="row-span-3 flex items-center justify-center font-bold text-lg text-[#003366]">
                        {formatCurrency(cotizacionFinal?.prima_exceso)}
                    </Cell>

                    <LabelCell>Daños Materiales (DM)</LabelCell>
                    <Cell className="text-right font-mono">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 2)) : '-'}</Cell>
                    <Cell className="text-right font-mono">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 5)) : '-'}</Cell>

                    <LabelCell>Varias Reclamaciones Relacionadas con un mismo Evento (LIM)</LabelCell>
                    <Cell className="text-right font-mono">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 3)) : '-'}</Cell>
                    <div className="grid grid-cols-2">
                        <div className="p-1 border-r border-slate-300 text-xs">(DP)</div>
                        <div className="p-1 text-right font-mono text-xs">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 6)) : '-'}</div>
                        <div className="p-1 border-t border-r border-slate-300 text-xs">(DM)</div>
                        <div className="p-1 border-t text-right font-mono text-xs">{sumasAseguradas?.exceso?.length ? formatCurrency(getSuma('exceso', 7)) : '-'}</div>
                    </div>
                </div>
            </div>

            <div>
                <TableHeader title="Cobertura Opcional (Tripulante)" />
                <div className="grid grid-cols-3 bg-white">
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Cobertura</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Suma Asegurada</div>
                    <div className="p-2 border border-slate-300 text-xs font-bold text-center bg-blue-50">Prima</div>

                    <LabelCell>Gastos Médicos, Quirúrgicos, Farmacéuticos y Hospitalarios</LabelCell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('opcional', 8))}</Cell>
                    <Cell className="text-right font-mono">{formatCurrency(cotizacionFinal?.prima_gastos_medicos)}</Cell>

                    <LabelCell>Invalidez Total y Permanente</LabelCell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('opcional', 9))}</Cell>
                    <Cell className="text-right font-mono">{formatCurrency(cotizacionFinal?.prima_invalidez)}</Cell>

                    <LabelCell>Muerte Accidental</LabelCell>
                    <Cell className="text-right font-mono">{formatCurrency(getSuma('opcional', 10))}</Cell>
                    <Cell className="text-right font-mono">{formatCurrency(cotizacionFinal?.prima_muerte_accidental)}</Cell>
                </div>
            </div>

            <div className="flex justify-between items-center bg-[#003366] text-white p-4 font-bold mt-8">
                <span>Total Prima a Pagar</span>
                <span className="text-xl font-mono">{formatCurrency(cotizacionFinal?.prima_total)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                    <div className="bg-[#003366] text-white py-1 px-4 font-bold text-sm">Condiciones</div>
                    <textarea
                        className="w-full p-2 border border-slate-300 text-sm h-24 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Escriba condiciones adicionales..."
                        defaultValue={condiciones}
                        onBlur={(e) => updateData('condiciones', e.target.value)}
                    />
                </div>
                <div>
                    <div className="bg-[#003366] text-white py-1 px-4 font-bold text-sm">Observaciones</div>
                    <textarea
                        className="w-full p-2 border border-slate-300 text-sm h-24 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Escriba observaciones adicionales..."
                        defaultValue={observaciones}
                        onBlur={(e) => updateData('observaciones', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
