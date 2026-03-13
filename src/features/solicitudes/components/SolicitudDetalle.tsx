import { ArrowLeft, Loader2, Printer } from 'lucide-react';
import { useSolicitudDetalle } from '../../quote/hooks/useSolicitudes';
import bannerImg from '../../../assets/imagen-banner-cotizador.png';
import footerImg from '../../../assets/footer-cotizador.png';

interface Props {
    solicitudId: number;
    onVolver: () => void;
}

const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null) return '0,00';
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-[#002060] text-white text-center py-1 font-bold text-xs uppercase tracking-wider">
        {title}
    </div>
);

const FormField = ({ label, value, className = "" }: { label: string; value?: string | number | null; className?: string }) => (
    <div className={`flex items-end gap-2 ${className}`}>
        <span className="text-[10px] font-bold text-[#002060] uppercase whitespace-nowrap mb-0.5">{label}</span>
        <div className="flex-1 border-b border-[#002060] text-[11px] text-black px-1 min-h-[22px] flex items-center">
            {value ?? ''}
        </div>
    </div>
);

export const SolicitudDetalle = ({ solicitudId, onVolver }: Props) => {
    const { data, isLoading, isError } = useSolicitudDetalle(solicitudId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-[#002060]">
                <Loader2 className="animate-spin w-10 h-10 mb-4" />
                <span className="font-semibold">Cargando Solicitud...</span>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="text-center py-20 text-red-600 bg-white border border-red-100 rounded-lg">
                <p className="font-bold text-lg mb-4">Error al cargar el detalle</p>
                <button onClick={onVolver} className="px-6 py-2 bg-[#002060] text-white rounded hover:bg-blue-900 transition-colors">
                    Volver al listado
                </button>
            </div>
        );
    }

    const formatVEODate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    const basica = data.coberturas.find(c => c.tipo_cobertura === 'BASICA');
    const exceso = data.coberturas.find(c => c.tipo_cobertura === 'EXCESO');

    // Totales
    const primaTotalCoberturas = data.coberturas.reduce((acc, c) => acc + (c.prima ?? 0), 0);
    const opcional = data.opcionales?.[0] || {};
    const primaOpcional = (opcional.prima_gasto ?? 0) + (opcional.prima_invalidez ?? 0) + (opcional.prima_muerte ?? 0);
    const primaTotal = primaTotalCoberturas + primaOpcional;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 print:p-0 print:m-0 print:bg-white print:absolute print:top-0 print:left-0 print:w-full print:z-[50] print:min-h-0">
            {/* Native CSS Print Optimization */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        size: auto; 
                        margin: 10px; 
                    }
                    body { 
                        background: white !important;
                    }
                    /* Ensure headers stay blue */
                    .bg-\\[\\#002060\\] {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .bg-blue-50 {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}} />

            {/* Control Header (Actions) - Hidden in print */}
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button
                    onClick={onVolver}
                    className="flex items-center text-[#002060] hover:underline font-bold transition-all"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Volver al listado
                </button>
            </div>

            {/* Sticky Print Button - Hidden in print */}
            <button
                onClick={() => window.print()}
                className="fixed right-4 top-24 z-50 p-3 bg-[#002060] text-white rounded-full shadow-2xl hover:bg-blue-900 transition-all flex items-center group print:hidden"
            >
                <Printer className="w-5 h-5" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold text-xs uppercase">
                    &nbsp;&nbsp;Imprimir / PDF
                </span>
            </button>

            {/* Main Physical Document Box */}
            <div className="max-w-6xl mx-auto border border-slate-200 shadow-2xl bg-white p-0 overflow-hidden print:shadow-none print:border-0 print:max-w-none print:w-screen print:m-0 print:color-adjust-exact flex flex-col min-h-[1150px] print:min-h-[280mm]">

                {/* Info Header (Metadata) - Outside the document but inside the printable container */}

                <div className="flex justify-between items-end px-8 pb-0 print:pt-4">
                    <span className="text-sm text-black font-bold">{"Fecha de Solicitud: " + formatVEODate(data.fecha_emision)}</span>
                    <div className="flex items-center gap-3">


                        <span className="text-sm font-bold ">N° Solicitud: #{data.id}</span>

                        <span className={`px-3 py-1 mt-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${data.status === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {data.status === 1 ? 'GENERADA' : 'EMITIDA'}
                        </span>
                        <span className="text-gray-400 text-[10px] font-mono">v{data.nro_version}</span>
                    </div>

                </div>


                <img src={bannerImg} alt="Banner Altamira" className="w-full mb-0 shadow-sm block relative z-10" />

                <div className="p-8 space-y-6 print:p-8 print:space-y-2 relative z-20 flex-grow flex flex-col">
                    <h1 className="text-center text-[10px] font-bold leading-tight uppercase tracking-tight -mt-4 mb-2 print:mt-2 print:mb-2 text-[#002060]">
                        RESPONSABILIDAD CIVIL PARA EL TRANSPORTADOR POR CARRETERA EN VIAJE INTERNACIONAL ENTRE LA REPÚBLICA DE COLOMBIA Y LA<br />
                        REPÚBLICA BOLIVARIANA DE VENEZUELA
                    </h1>

                    {/* Datos del Solicitante */}
                    <div className="border border-[#002060]">
                        <SectionHeader title="Datos del Solicitante" />
                        <div className="p-2 space-y-3">
                            <div className="grid grid-cols-12 gap-6">
                                <FormField label="Solicitante" value={data.solicitante_nombre} className="col-span-8" />
                                <FormField label="Tipo de Persona" value={data.tipo_persona === 'N' ? 'NATURAL' : 'JURÍDICA'} className="col-span-4 print:col-span-3" />
                            </div>
                            <div className="grid grid-cols-12 gap-6">
                                <FormField label="Correo" value={data.solicitante_email} className="col-span-7" />
                                <FormField label="Sucursal" value={data.solicitante_sucursal_nombre} className="col-span-5" />
                            </div>
                            <div className="grid grid-cols-12 gap-6">
                                <FormField label="Código Intermediario" value={data.id_intermediario} className="col-span-3" />
                                <FormField label="Nombre Intermediario" value={data.nom_intermediario} className="col-span-9" />
                            </div>
                        </div>

                        <SectionHeader title="Datos del Vehículo" />
                        <div className="p-2 space-y-4">
                            <div className="grid grid-cols-4 gap-6">
                                <FormField label="Marca" value={data.marca_nombre} />
                                <FormField label="Modelo" value={data.modelo_nombre} />
                                <FormField label="Año" value={data.anho} />
                                <FormField label="Placa" value={data.placa} />
                            </div>
                            <div className="grid grid-cols-12 gap-6">
                                <FormField label="N° de Puestos" value={data.nro_puesto} className="col-span-2" />
                                <FormField label="Duración del Viaje" value={data.duracion_viaje_nombre} className="col-span-6" />
                                <FormField label="Exceso" value={data.tipo_exceso_nombre} className="col-span-4" />
                            </div>

                            <div className="grid grid-cols-12 gap-6">
                                <FormField label="Tipo de Transporte" value={data.tipo_vehiculo_nombre}
                                    className="col-span-2"
                                />
                                <FormField label="" value={data.tipo_vehiculo_etiqueta}
                                    className="col-span-10"
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <FormField label="Tasación Especial" value={data.tasacion_especial_nombre} />
                            </div>
                        </div>

                        <SectionHeader title="Datos Persona Autorizada para Cotizar" />
                        <div className="p-2 space-y-1">
                            <div className="grid grid-cols-12 gap-6">
                                <FormField label="Nombre y Apellido" value={data.autorizado_nombre} className="col-span-8" />
                                <FormField label="Sucursal" value={data.autorizado_sucursal_nombre} className="col-span-4" />
                            </div>
                        </div>
                    </div>

                    {/* Cobertura Básica */}
                    <div>
                        <SectionHeader title="Cobertura Básica" />
                        <table className="w-full border-collapse border border-[#002060] text-[10px]">
                            <thead>
                                <tr className="bg-blue-50 text-[#002060] font-bold h-10 text-center">
                                    <th className="border border-[#002060] p-1 w-1/4">Definición de Términos</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Daños a terceros no transportados</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Daños a Pasajeros</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Prima según duración del viaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-[#002060] p-2 font-bold">Muerte y/o Daños Personales (DP)</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black">$ 20.000,00</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black">$ 20.000,00</td>
                                    <td rowSpan={3} className="border border-[#002060] p-1 text-center align-middle font-bold text-lg text-black">
                                        $ {formatCurrency(basica?.prima)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-[#002060] p-2 font-bold">Daños Materiales (DM)</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black">$ 15.000,00</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black">$ 500,00</td>
                                </tr>
                                <tr>
                                    <td className="border border-[#002060] p-2 font-bold">Varias Reclamaciones Relacionadas con un mismo Evento (LIM)</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black">$ 120.000,00</td>
                                    <td className="p-0 border border-[#002060]">
                                        <table className="w-full border-collapse">
                                            <tbody>
                                                <tr className="border-b border-[#002060]">
                                                    <td className="border-r border-[#002060] p-1 font-bold w-1/3">(DP)</td>
                                                    <td className="p-1 text-center font-bold text-black uppercase">$ 200.000,00</td>
                                                </tr>
                                                <tr>
                                                    <td className="border-r border-[#002060] p-1 font-bold">(DM)</td>
                                                    <td className="p-1 text-center font-bold text-black uppercase">$ 10.000,00</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/*Cobertura Exceso*/}
                    <div>
                        <SectionHeader title="Cobertura Exceso" />
                        <table className="w-full border-collapse border border-[#002060] text-[10px]">
                            <thead>
                                <tr className="bg-blue-50 text-[#002060] font-bold h-10 text-center">
                                    <th className="border border-[#002060] p-1 w-1/4">Definición de Términos</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Daños a terceros no transportados</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Daños a Pasajeros</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Prima según duración del viaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="h-8">
                                    <td className="border border-[#002060] p-2 font-bold">Muerte y/o Daños Personales (DP)</td>
                                    <td className="border border-[#002060] p-1"></td>
                                    <td className="border border-[#002060] p-1"></td>
                                    <td rowSpan={3} className="border border-[#002060] p-1 text-center align-middle font-bold text-lg text-black bg-slate-50/50">
                                        {exceso?.prima ? `$ ${formatCurrency(exceso.prima)}` : ''}
                                    </td>
                                </tr>
                                <tr className="h-8">
                                    <td className="border border-[#002060] p-2 font-bold">Daños Materiales (DM)</td>
                                    <td className="border border-[#002060] p-1"></td>
                                    <td className="border border-[#002060] p-1"></td>
                                </tr>
                                <tr className="h-10">
                                    <td className="border border-[#002060] p-2 font-bold">Varias Reclamaciones Relacionadas con un mismo Evento (LIM)</td>
                                    <td className="border border-[#002060] p-1"></td>
                                    <td className="p-0 border border-[#002060]">
                                        <table className="w-full h-full border-collapse">
                                            <tbody>
                                                <tr className="border-b border-[#002060] h-6">
                                                    <td className="border-r border-[#002060] p-1 font-bold w-1/3">(DP)</td>
                                                    <td className="p-1"></td>
                                                </tr>
                                                <tr className="h-6">
                                                    <td className="border-r border-[#002060] p-1 font-bold">(DM)</td>
                                                    <td className="p-1"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Cobertura Opcional */}
                    <div className='print:pt-[15px]'>
                        <div className="flex w-full">
                            <div className="bg-[#002060] text-white text-center py-1 font-bold text-xs uppercase tracking-wider w-full">
                                Cobertura Opcional (Tripulante)
                            </div>
                        </div>
                        <table className="w-full border-collapse border border-[#002060] text-[10px]">
                            <thead>
                                <tr className="bg-blue-50 text-[#002060] font-bold h-10 text-center">
                                    <th className="border border-[#002060] p-1 w-1/2 text-left px-4">Cobertura</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Suma Asegurada</th>
                                    <th className="border border-[#002060] p-1 w-1/4">Prima</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="h-8">
                                    <td className="border border-[#002060] p-2 font-bold px-4">Gastos Médicos, Quirúrgicos, Farmacéuticos y Hospitalarios</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black uppercase">$ 1.000,00</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black uppercase">
                                        $ {formatCurrency(opcional.prima_gasto)}
                                    </td>
                                </tr>
                                <tr className="h-8">
                                    <td className="border border-[#002060] p-2 font-bold px-4">Invalidez Total y Permanente</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black uppercase">$ 4.000,00</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black uppercase">
                                        $ {formatCurrency(opcional.prima_invalidez)}
                                    </td>
                                </tr>
                                <tr className="h-8">
                                    <td className="border border-[#002060] p-2 font-bold px-4">Muerte Accidental</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black uppercase">$ 6.000,00</td>
                                    <td className="border border-[#002060] p-1 text-center font-bold text-black uppercase">
                                        $ {formatCurrency(opcional.prima_muerte)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total Prima */}
                    <div className="bg-[#002060] text-white flex justify-around py-1 text-xs font-bold shadow-lg shadow-blue-900/10 print:shadow-none">
                        <span className="text-sm tracking-wide">Total Prima a Pagar</span>
                        <span className="text-lg font-mono tracking-wider">$ {formatCurrency(primaTotal)}</span>
                    </div>

                    {/* Condiciones y Observaciones */}
                    <div className="grid grid-cols-1 gap-6 print:gap-4">
                        <div>
                            <SectionHeader title="Condiciones" />
                            <div className="border border-[#002060] p-4 min-h-[100px] text-[11px] leading-relaxed text-black bg-white">
                                {data.condiciones || ''}
                            </div>
                        </div>
                        <div>
                            <SectionHeader title="Observaciones Adicionales" />
                            <div className="border border-[#002060] p-4 min-h-[100px] text-[11px] leading-relaxed text-black bg-white">
                                {data.observaciones || ''}
                            </div>
                        </div>
                    </div>

                    {/* Footer Slogan - Pushed to bottom */}
                    <footer className="mt-auto">
                        <div className="flex justify-center pt-8 pb-4 print:pt-4 print:pb-2 print:break-inside-avoid">
                            <img
                                src={footerImg}
                                alt="Eslogan Altamira"
                                className="w-35 md:w-32 object-contain"
                            />
                        </div>

                        <div className="text-center text-[8px] font-bold text-slate-400 mt-2 pt-2 border-t border-slate-100 italic">
                            Seguros Altamira C.A. RIF: J-00152250-1 Inscrita en la Superintendencia de la Actividad Aseguradora bajo el N° 107
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};
