import { useState, useEffect, useRef } from 'react';
import { Trash2, FileText, Search, CalendarIcon, X, RefreshCw, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SolicitudListItem } from '@/types';
import { useSolicitudesList, useEliminarSolicitud } from '../../quote/hooks/useSolicitudes';
import { useToast } from '@/lib/toast';
import { useSolicitudesStore } from '@/stores/useSolicitudesStore';
import { useSucursalesDisponibles } from '@/features/quote/hooks/useSucursalesDisponibles';
import { useAuthStore } from '@/stores/auth';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 400;

function useDebounce(value: string, delay: number = DEBOUNCE_MS): string {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setDebouncedValue(value), delay);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [value, delay]);

    return debouncedValue;
}

const parseDate = (str: string) => {
    const parsed = parse(str, 'dd/MM/yyyy', new Date());
    return isValid(parsed) ? parsed : undefined;
};

interface Props {
    onVerDetalle: (id: number) => void;
}

const StatusBadge = ({ status }: { status: number }) => {
    if (status === 0) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                Borrador
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
            Generada
        </span>
    );
};

const ConfirmDialog = ({
    open, onConfirm, onCancel, loading
}: { open: boolean; onConfirm: () => void; onCancel: () => void; loading: boolean }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">¿Eliminar solicitud?</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Esta acción eliminará la solicitud y todos sus datos asociados. Esta operación no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PaginacionProps {
    paginaActual: number;
    totalPaginas: number;
    totalRegistros: number;
    tamanoPagina: number;
    onCambiarPagina: (pagina: number) => void;
    isFetching: boolean;
}

const Paginacion = ({
    paginaActual,
    totalPaginas,
    totalRegistros,
    tamanoPagina,
    onCambiarPagina,
    isFetching,
}: PaginacionProps) => {
    const getPageNumbers = (): number[] => {
        const VISIBLE = 5;
        let start = Math.max(1, paginaActual - Math.floor(VISIBLE / 2));
        const end = Math.min(totalPaginas, start + VISIBLE - 1);
        start = Math.max(1, end - VISIBLE + 1);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const primerRegistro = (paginaActual - 1) * tamanoPagina + 1;
    const ultimoRegistro = Math.min(paginaActual * tamanoPagina, totalRegistros);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-white rounded-b-xl">
            <p className="text-xs text-slate-500">
                Mostrando{' '}
                <span className="font-semibold text-slate-700">{primerRegistro}–{ultimoRegistro}</span>
                {' '}de{' '}
                <span className="font-semibold text-slate-700">{totalRegistros}</span> solicitudes
            </p>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline" size="sm"
                    onClick={() => onCambiarPagina(paginaActual - 1)}
                    disabled={paginaActual <= 1 || isFetching}
                    className="h-8 w-8 p-0 border-slate-200"
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {getPageNumbers().map((page) => (
                    <Button
                        key={page}
                        variant={page === paginaActual ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onCambiarPagina(page)}
                        disabled={isFetching}
                        className={cn(
                            'h-8 w-8 p-0 text-xs',
                            page === paginaActual
                                ? 'bg-[#003366] hover:bg-[#002244] border-[#003366] text-white'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        )}
                        aria-label={`Ir a página ${page}`}
                        aria-current={page === paginaActual ? 'page' : undefined}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline" size="sm"
                    onClick={() => onCambiarPagina(paginaActual + 1)}
                    disabled={paginaActual >= totalPaginas || isFetching}
                    className="h-8 w-8 p-0 border-slate-200"
                    aria-label="Página siguiente"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            <p className="text-xs text-slate-500 hidden sm:block">
                Página <span className="font-semibold text-slate-700">{paginaActual}</span> de{' '}
                <span className="font-semibold text-slate-700">{totalPaginas}</span>
            </p>
        </div>
    );
};

export const SolicitudesList = ({ onVerDetalle }: Props) => {
    const { data: response, isLoading, isError, refetch, isFetching } = useSolicitudesList();
    const { mutate: eliminar, isPending: isDeleting } = useEliminarSolicitud();
    const { success: toastSuccess, error: toastError } = useToast();
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const rol = user?.id_rol ?? 3;
    const { sucursales } = useSucursalesDisponibles();

    const {
        searchApplicant,
        searchVehicle,
        statusFilter,
        dateRange,
        fromInput,
        toInput,
        paginaActual,
        idSucursal,
        setSearchApplicant,
        setSearchVehicle,
        setStatusFilter,
        setDateRange,
        setFromInput,
        setToInput,
        setRangeOnly,
        setPaginaActual,
        setIdSucursal,
        resetFilters,
    } = useSolicitudesStore();

    // Estado local para inputs de texto — el store se actualiza después del debounce
    const [applicantInput, setApplicantInput] = useState(searchApplicant);
    const [vehicleInput, setVehicleInput] = useState(searchVehicle);

    const debouncedApplicant = useDebounce(applicantInput);
    const debouncedVehicle   = useDebounce(vehicleInput);

    useEffect(() => { setSearchApplicant(debouncedApplicant); }, [debouncedApplicant, setSearchApplicant]);
    useEffect(() => { setSearchVehicle(debouncedVehicle);     }, [debouncedVehicle,   setSearchVehicle]);

    const handleResetFilters = () => {
        setApplicantInput('');
        setVehicleInput('');
        resetFilters();
    };

    const isFiltered = searchApplicant || searchVehicle || statusFilter !== 'all' || dateRange || idSucursal != null;

    const handleFromInputChange = (val: string) => {
        setFromInput(val);
        if (val.length === 10) {
            const parsed = parseDate(val);
            if (parsed) {
                setRangeOnly({
                    from: parsed,
                    to: dateRange?.to && parsed <= dateRange.to ? dateRange.to : undefined
                });
            }
        } else if (val === '') {
            setRangeOnly(undefined);
        }
    };

    const handleToInputChange = (val: string) => {
        setToInput(val);
        if (val.length === 10) {
            const parsed = parseDate(val);
            if (parsed && dateRange?.from) {
                if (parsed >= dateRange.from) {
                    setRangeOnly({ ...dateRange, from: dateRange.from, to: parsed });
                }
            }
        } else if (val === '') {
            setRangeOnly({ ...dateRange, from: dateRange?.from, to: undefined });
        }
    };

    const handleEliminar = () => {
        if (!confirmId) return;
        eliminar(confirmId, {
            onSuccess: () => {
                toastSuccess('Solicitud eliminada correctamente');
                setConfirmId(null);
            },
            onError: (err: unknown) => {
                const message =
                    err instanceof Error
                        ? err.message
                        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
                toastError(message || 'Error al eliminar la solicitud');
                setConfirmId(null);
            },
        });
    };

    const handleRowClick = (s: SolicitudListItem) => {
        if (s.status === 0) {
            navigate(`/app/cotizar/${s.id}`);
        } else {
            onVerDetalle(s.id);
        }
    };

    const solicitudes = response?.data ?? [];
    const meta        = response?.meta;

    // Muestra la barra de paginación completa (con controles de navegación) sólo cuando hay
    // más de una página y no hay filtros activos en el servidor.
    const showPaginationControls = meta && !meta.tiene_filtros && meta.total_paginas > 1;

    // Muestra al menos el resumen "Mostrando X de X" cuando hay datos en una sola página.
    // Esto confirma al usuario que el sistema de paginación está activo y el conteo es correcto.
    const showPaginationSummary = meta && !meta.tiene_filtros && meta.total_paginas === 1 && meta.total_registros > 0;

    // Cualquiera de los dos casos ocupa el footer de la tabla, lo que afecta el border-radius.
    const hasPaginationFooter = showPaginationControls || showPaginationSummary;

    // --- Guards de estado ---

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-[#003366]">
                <svg className="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando solicitudes...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold">Error al cargar las solicitudes</p>
            </div>
        );
    }

    // Empty state: sólo se muestra cuando la carga terminó sin error, el backend
    // confirma que no hay registros en absoluto (total_registros === 0) Y no hay
    // filtros activos. Si hay filtros activos y el resultado es vacío, se deja que
    // la tabla muestre el mensaje interno con el botón "Limpiar todos los filtros".
    if (!isLoading && !isError && meta?.total_registros === 0 && !isFiltered) {
        return (
            <div className="text-center py-16 text-slate-400">
                <FileText className="w-14 h-14 mx-auto mb-4 opacity-40" />
                <p className="text-lg font-semibold">No hay solicitudes registradas</p>
                <p className="text-sm mt-1">Las solicitudes generadas aparecerán aquí.</p>
            </div>
        );
    }

    return (
        <>
            <ConfirmDialog
                open={!!confirmId}
                onConfirm={handleEliminar}
                onCancel={() => setConfirmId(null)}
                loading={isDeleting}
            />

            <div className="mb-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    {/* Selector de sucursal: solo para admin (rol 1) y supervisor (rol 2) */}
                    {(rol === 1 || rol === 2) && sucursales.length > 0 && (
                        <div className="flex items-center gap-2 min-w-[200px]">
                            <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                            <Select
                                value={idSucursal != null ? String(idSucursal) : 'todas'}
                                onValueChange={(val) =>
                                    setIdSucursal(val === 'todas' ? null : parseInt(val))
                                }
                            >
                                <SelectTrigger className="bg-slate-50/50 border-slate-200 text-sm w-full">
                                    <SelectValue placeholder={rol === 1 ? 'Todas las sucursales' : 'Todas mis sucursales'} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">
                                        {rol === 1 ? 'Todas las sucursales' : 'Todas mis sucursales'}
                                    </SelectItem>
                                    {sucursales.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Applicant Search */}
                    <div className="relative flex-1 min-w-[150px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Buscar solicitante..."
                            value={applicantInput}
                            onChange={(e) => setApplicantInput(e.target.value)}
                            className="pl-9 bg-slate-50/50 border-slate-200"
                        />
                    </div>

                    {/* Vehicle Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Marca, modelo o placa..."
                            value={vehicleInput}
                            onChange={(e) => setVehicleInput(e.target.value)}
                            className="pl-9 bg-slate-50/50 border-slate-200"
                        />
                    </div>

                    {/* Status Select */}
                    <div className="w-[160px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="1">Generada</SelectItem>
                                <SelectItem value="0">Borrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range Picker */}
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal bg-slate-50/50 border-slate-200",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                                                {format(dateRange.to, "LLL dd, y", { locale: es })}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y", { locale: es })
                                        )
                                    ) : (
                                        <span>Seleccionar rango de fechas</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-4" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Desde</label>
                                            <Input
                                                placeholder="DD/MM/YYYY"
                                                value={fromInput}
                                                onChange={(e) => handleFromInputChange(e.target.value)}
                                                className="h-8 text-xs bg-slate-50/50"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1 block">Hasta</label>
                                            <Input
                                                placeholder="DD/MM/YYYY"
                                                value={toInput}
                                                onChange={(e) => handleToInputChange(e.target.value)}
                                                className="h-8 text-xs bg-slate-50/50"
                                            />
                                        </div>
                                    </div>
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                        locale={es}
                                        className="border-t border-slate-100 pt-4"
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Clear Button */}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={handleResetFilters}
                            className="text-slate-500 hover:text-slate-800"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Limpiar
                        </Button>
                    )}

                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className={cn(
                            "bg-slate-50/50 border-slate-200 text-slate-500 hover:text-[#003366] transition-all",
                            isFetching && "opacity-80"
                        )}
                        title="Actualizar lista"
                    >
                        <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                    </Button>
                </div>
            </div>

            <div className={cn(
                "overflow-x-auto border border-slate-200 rounded-xl shadow-lg bg-white transition-opacity duration-200",
                isFetching && "opacity-60"
            )}>
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-[#003366] text-white">
                            <th className="px-4 py-3 font-semibold rounded-tl-xl whitespace-nowrap">#</th>
                            <th className="px-4 py-3 font-semibold">Solicitante</th>
                            <th className="px-4 py-3 font-semibold">Placa / Vehículo</th>
                            <th className="px-4 py-3 font-semibold">Versión</th>
                            <th className="px-4 py-3 font-semibold">Fecha</th>
                            <th className="px-4 py-3 font-semibold text-center">Estado</th>
                            <th className={cn("px-4 py-3 font-semibold text-center", !hasPaginationFooter && "rounded-tr-xl")}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitudes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="w-10 h-10 opacity-20" />
                                        <p className="font-medium">No se encontraron solicitudes que coincidan con los filtros</p>
                                        {isFiltered && (
                                            <button
                                                onClick={handleResetFilters}
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                            >
                                                Limpiar todos los filtros
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            solicitudes.map((s: SolicitudListItem, idx: number) => (
                                <tr
                                    key={s.id}
                                    className={`border-b border-slate-100 hover:bg-blue-50 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                                    onClick={() => handleRowClick(s)}
                                >
                                    <td className="px-4 py-3 font-mono text-slate-500">#{s.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-800">{s.solicitante_nombre}</div>
                                        <div className="text-xs text-slate-400">{s.solicitante_email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-mono font-semibold text-[#003366]">{s.vehiculo_placa}</div>
                                        <div className="text-xs text-slate-400">{s.vehiculo_marca} {s.vehiculo_modelo} {s.vehiculo_anho}</div>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.nro_version}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {new Date(s.fecha_emision).toLocaleDateString('es-VE')}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={s.status} />
                                    </td>
                                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                title="Eliminar solicitud"
                                                onClick={() => setConfirmId(s.id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Paginación completa: controles de navegación + resumen, cuando hay más de 1 página */}
                {showPaginationControls && (
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={meta.total_paginas}
                        totalRegistros={meta.total_registros}
                        tamanoPagina={meta.tamano_pagina}
                        onCambiarPagina={setPaginaActual}
                        isFetching={isFetching}
                    />
                )}

                {/* Resumen sin controles: cuando todos los registros caben en una sola página */}
                {showPaginationSummary && (
                    <div className="px-4 py-3 border-t border-slate-200 bg-white rounded-b-xl">
                        <p className="text-xs text-slate-500">
                            Mostrando{' '}
                            <span className="font-semibold text-slate-700">{meta.total_registros}</span>
                            {' '}de{' '}
                            <span className="font-semibold text-slate-700">{meta.total_registros}</span> solicitudes
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};
