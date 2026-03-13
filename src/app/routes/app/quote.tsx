import { QuoteWizard } from '@/features/quote/components/quote-wizard';

export const QuoteRoute = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003366]">Nueva Cotización</h1>
        <p className="text-slate-500">Póliza RCV Internacional - Colombia/Venezuela</p>
      </div>
      {/* Importamos el componente del feature */}
      <QuoteWizard />
    </div>
  );
};