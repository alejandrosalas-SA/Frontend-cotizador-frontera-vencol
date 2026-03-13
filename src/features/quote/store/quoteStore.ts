import { create } from 'zustand';
import type { SolicitudPayload } from '@/types';

// Extendemos para permitir campos parciales mientras llenamos el form
interface QuoteState {
  step: number;
  data: Partial<SolicitudPayload>;
  cotizacionFinal?: any;
  setCotizacionFinal: (data: any) => void;
  setStep: (step: number) => void;
  updateData: (section: keyof SolicitudPayload, value: any) => void;
  setAllData: (data: Partial<SolicitudPayload>) => void;
  reset: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  step: 1,
  data: {
    solicitante: undefined,
    vehiculo: undefined,
    coberturas: []
  },
  setCotizacionFinal: (data) => set({ cotizacionFinal: data }),
  setStep: (step) => set({ step }),
  updateData: (section, value) =>
    set((state) => ({ data: { ...state.data, [section]: value } })),
  setAllData: (newData) => set({ data: newData }),
  reset: () => set({ step: 1, data: {}, cotizacionFinal: undefined })
}));