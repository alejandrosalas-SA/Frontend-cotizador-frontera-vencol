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

    // Actions
    setSearchApplicant: (val: string) => void;
    setSearchVehicle: (val: string) => void;
    setStatusFilter: (val: string) => void;
    setDateRange: (range: DateRange | undefined) => void;
    setRangeOnly: (range: DateRange | undefined) => void;
    setFromInput: (val: string) => void;
    setToInput: (val: string) => void;
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

    setSearchApplicant: (searchApplicant) => set({ searchApplicant }),
    setSearchVehicle: (searchVehicle) => set({ searchVehicle }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),

    setDateRange: (range) => set({
        dateRange: range,
        fromInput: range?.from ? formatInputDate(range.from) : '',
        toInput: range?.to ? formatInputDate(range.to) : ''
    }),

    setRangeOnly: (dateRange) => set({ dateRange }),

    setFromInput: (fromInput) => set({ fromInput }),
    setToInput: (toInput) => set({ toInput }),

    resetFilters: () => set({
        searchApplicant: '',
        searchVehicle: '',
        statusFilter: 'all',
        dateRange: undefined,
        fromInput: '',
        toInput: ''
    }),
}));
