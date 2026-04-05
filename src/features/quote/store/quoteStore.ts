import { create } from 'zustand';
import type { SolicitudPayload } from '@/types';

// Extendemos para permitir campos parciales mientras llenamos el form
interface QuoteState {
  step: number;
  data: Partial<SolicitudPayload>;
  cotizacionFinal?: any;
  con_opcional: boolean;
  setCotizacionFinal: (data: any) => void;
  setStep: (step: number) => void;
  updateData: (section: keyof SolicitudPayload, value: any) => void;
  setAllData: (data: Partial<SolicitudPayload>) => void;
  setConOpcional: (val: boolean) => void;
  reset: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  step: 1,
  data: {
    solicitante: undefined,
    vehiculo: undefined,
    coberturas: []
  },
  con_opcional: false,
  setCotizacionFinal: (data) => set({ cotizacionFinal: data }),
  setStep: (step) => set({ step }),
  updateData: (section, value) =>
    set((state) => ({ data: { ...state.data, [section]: value } })),
  setAllData: (newData) => set({ data: newData }),
  setConOpcional: (val) => set({ con_opcional: val }),
  reset: () => set({ step: 1, data: {}, cotizacionFinal: undefined, con_opcional: false })
}));