import { create } from 'zustand';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface SolicitudesFiltersState {
    searchApplicant: string;
    searchVehicle: string;
    statusFilter: string;
    dateRange: DateRange | undefined;
    fromInput: string;
    toInput: string;
    paginaActual: number;
    idSucursal: number | null; // filtro por sucursal (para admin y supervisor)

    // Actions
    setSearchApplicant: (val: string) => void;
    setSearchVehicle: (val: string) => void;
    setStatusFilter: (val: string) => void;
    setDateRange: (range: DateRange | undefined) => void;
    setRangeOnly: (range: DateRange | undefined) => void;
    setFromInput: (val: string) => void;
    setToInput: (val: string) => void;
    setPaginaActual: (n: number) => void;
    setIdSucursal: (id: number | null) => void;
    resetFilters: () => void;
}

const formatInputDate = (date: Date | undefined) => {
    return date ? format(date, 'dd/MM/yyyy') : '';
};

export const useSolicitudesStore = create<SolicitudesFiltersState>((set) => ({
    searchApplicant: '',
    searchVehicle: '',
    statusFilter: 'all',
    dateRange: undefined,
    fromInput: '',
    toInput: '',
    paginaActual: 1,
    idSucursal: null,

    setSearchApplicant: (searchApplicant) => set({ searchApplicant, paginaActual: 1 }),
    setSearchVehicle:   (searchVehicle)   => set({ searchVehicle,   paginaActual: 1 }),
    setStatusFilter:    (statusFilter)    => set({ statusFilter,    paginaActual: 1 }),
    setIdSucursal:      (idSucursal)      => set({ idSucursal,      paginaActual: 1 }),

    setDateRange: (range) => set({
        dateRange: range,
        fromInput: range?.from ? formatInputDate(range.from) : '',
        toInput:   range?.to   ? formatInputDate(range.to)   : '',
        paginaActual: 1,
    }),

    setRangeOnly: (dateRange) => set({ dateRange, paginaActual: 1 }),

    setFromInput: (fromInput) => set({ fromInput }),
    setToInput:   (toInput)   => set({ toInput }),

    setPaginaActual: (paginaActual) => set({ paginaActual }),

    resetFilters: () => set({
        searchApplicant: '',
        searchVehicle: '',
        statusFilter: 'all',
        dateRange: undefined,
        fromInput: '',
        toInput: '',
        paginaActual: 1,
        idSucursal: null,
    }),
}));
