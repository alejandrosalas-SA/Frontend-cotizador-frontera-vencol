import { useState } from 'react';
import { SolicitudesList } from '@/features/solicitudes/components/SolicitudesList';
import { SolicitudDetalle } from '@/features/solicitudes/components/SolicitudDetalle';
import { FileText, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SolicitudesRoute = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header de la página */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#003366] flex items-center gap-2">
                        <FileText className="w-6 h-6" />
                        {selectedId ? 'Detalle de Solicitud' : 'Mis Solicitudes'}
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {selectedId
                            ? 'Visualiza o gestiona el borrador de cotización'
                            : 'Listado de todas tus cotizaciones generadas y borradores'}
                    </p>
                </div>
                {!selectedId && (
                    <button
                        onClick={() => navigate('/app/cotizar')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white text-sm font-bold rounded-lg shadow hover:bg-blue-900 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Nueva Cotización
                    </button>
                )}
            </div>

            {/* Contenido */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6">
                {selectedId ? (
                    <SolicitudDetalle
                        solicitudId={selectedId}
                        onVolver={() => setSelectedId(null)}
                    />
                ) : (
                    <SolicitudesList onVerDetalle={(id) => setSelectedId(id)} />
                )}
            </div>
        </div>
    );
};
