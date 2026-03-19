import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuoteStore } from '../store/quoteStore';
import { ApplicantForm } from './ApplicantForm';
import { VehicleForm } from './VehicleForm';
import { CoverageForm } from './CoverageForm';
import { useCreateSolicitud } from '../hooks/useSolicitud';
import { useSolicitudDetalle, useActualizarSolicitud } from '../hooks/useSolicitudes';
import { useCalcularCotizacionMutation } from '../hooks/useCoberturas';
import type { SolicitudPayload } from '@/types';
import { useToast } from '@/lib/toast';

export const QuoteWizard = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { step, setStep, data, setAllData, reset, setCotizacionFinal, updateData } = useQuoteStore();
  const [successId, setSuccessId] = useState<number | null>(null);
  const { error: toastError, success: toastSuccess } = useToast();

  const applicantFormRef = useRef<{ submitForm: () => Promise<boolean>, savePartial?: () => void }>(null);
  const vehicleFormRef = useRef<{ submitForm: () => Promise<boolean>, savePartial?: () => void }>(null);

  // Queries / Mutations
  const { data: detalle, isLoading: isFetching } = useSolicitudDetalle(isEditing ? Number(id) : null);
  const { mutate: createSolicitud, isPending: isCreating } = useCreateSolicitud();
  const { mutate: actualizarSolicitud, isPending: isUpdating } = useActualizarSolicitud();
  const { mutateAsync: calcularCotizacion, isPending: isCalculating } = useCalcularCotizacionMutation();
  const isSubmitting = isCreating || isUpdating || isCalculating;

  // ─── ADAPTER: Mapeo explícito de la respuesta plana del backend a objetos de formulario ───
  // Solo se activa al cargar un borrador (isEditing + detalle disponible).
  // Las coberturas/opcionales históricas se IGNORAN (status=0 → siempre se recalcula).
  const draftApplicantValues = isEditing && detalle ? {
    tipo_persona: detalle.tipo_persona as 'N' | 'J',
    solicitante: detalle.solicitante_nombre ?? '',
    email: detalle.solicitante_email ?? '',
    id_sucursal: detalle.solicitante_id_sucursal ?? null,
    id_intermediario: detalle.id_intermediario ?? null,
    nom_intermediario: detalle.nom_intermediario ?? '',
  } : (data.solicitante as any) || undefined;

  const draftVehicleValues = isEditing && detalle ? {
    marca: detalle.marca != null ? String(detalle.marca) : '',
    modelo: detalle.modelo != null ? String(detalle.modelo) : '',
    anho: detalle.anho ?? new Date().getFullYear(),
    placa: detalle.placa ?? '',
    nro_puesto: detalle.nro_puesto ?? 1,
    duracion: detalle.duracion ?? 7,
    tipo_exceso: detalle.tipo_exceso ?? null,
    tipo_vehiculo: detalle.tipo_vehiculo ?? null,
    tasacion_especial: detalle.tasacion_especial ?? null,
    autorizado_nombre: detalle.autorizado_nombre ?? '',
    autorizado_sucursal: detalle.autorizado_sucursal ?? null,
  } : (data.vehiculo as any) || undefined;

  // Carga el store con los metadatos del borrador (sin coberturas históricas)
  useEffect(() => {
    if (isEditing && detalle) {
      setAllData({
        solicitante: draftApplicantValues as any,
        vehiculo: draftVehicleValues as any,
        coberturas: [], // Se ignoran — se recalculan al pasar al paso 3
        opcionales: [], // Se ignoran — se recalculan al pasar al paso 3
        condiciones: detalle.condiciones,
        observaciones: detalle.observaciones,
        // nro_version NO se copia — el cálculo usará la tarifa activa
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, detalle?.id]);

  // Limpiar store al desmontar
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const steps = [
    { title: "Datos del Solicitante", num: 1 },
    { title: "Datos del Vehículo", num: 2 },
    { title: "Cuotas y Coberturas", num: 3 }
  ];

  const renderStep = () => {
    if (isFetching) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <span className="text-slate-500 font-bold animate-pulse">Cargando borrador...</span>
        </div>
      );
    }
    switch (step) {
      case 1: return <ApplicantForm ref={applicantFormRef} initialValues={draftApplicantValues} />;
      case 2: return <VehicleForm ref={vehicleFormRef} initialValues={draftVehicleValues} />;
      case 3: return <CoverageForm />;
      default: return null;
    }
  };

  const handleNextStep = async () => {
    let isStepValid = false;

    if (step === 1 && applicantFormRef.current) {
      isStepValid = await applicantFormRef.current.submitForm();
    } else if (step === 2 && vehicleFormRef.current) {
      isStepValid = await vehicleFormRef.current.submitForm();
      
      if (isStepValid) {
         // Validar que la cotizacion sea mayor a cero
         try {
             // El submitForm guardó los datos en el store global de forma sincrónica
             const currentData = useQuoteStore.getState().data;
             if (currentData.vehiculo) {
                 // IMPORTANTE: NO enviar nro_version → el SP usará la tarifa activa vigente
                 const res = await calcularCotizacion({
                     vehiculo: currentData.vehiculo
                 });

                 if (!res.prima_total || res.prima_total <= 0) {
                     toastError("Las características de este vehículo no aplican para la póliza (Primas = $0.00)");
                     isStepValid = false;
                 } else {
                     setCotizacionFinal(res);
                     updateData('nro_version', res.nro_version);

                     const coberturas = [
                         { id_cobertura: 1, nombre: 'BASICA', prima: res.prima_basica, valor_asegurado: 0 },
                         { id_cobertura: 2, nombre: 'EXCESO', prima: res.prima_exceso, valor_asegurado: 0 }
                     ];
                     const opcionales = [
                         { id_cobertura: 3, nombre: 'OPCIONAL', prima_gasto: res.prima_gastos_medicos, prima_invalidez: res.prima_invalidez, prima_muerte: res.prima_muerte_accidental }
                     ];

                     updateData('coberturas', coberturas as any);
                     updateData('opcionales', opcionales as any);
                 }
             }
         } catch (error) {
             toastError("Ocurrió un error al calcular la pre-cotización del vehículo.");
             isStepValid = false;
         }
      }
    } else if (step === 3) {
      isStepValid = true; // Paso 3 es informativo (coberturas)
    }

    if (isStepValid) {
      setStep(step + 1);
    } else if (step === 1) {
      toastError("Hay entradas faltantes o con errores, revisa los datos del solicitante");
    }
  };

  const handleFinalize = async (status: number) => {
    // Always commit the active form's values to the store before sending requests
    if (step === 1 && applicantFormRef.current?.savePartial) {
      applicantFormRef.current.savePartial();
    } else if (step === 2 && vehicleFormRef.current?.savePartial) {
      vehicleFormRef.current.savePartial();
    }

    // Get latest state synchronously so we don't depend on the hook's render cycle
    const currentData = useQuoteStore.getState().data;

    if (!currentData.solicitante || !currentData.vehiculo) {
      toastError('Debe completar los datos del solicitante y vehículo antes de generar la cotización.');
      return;
    }

    const payload = {
      solicitante: {
        ...currentData.solicitante,
        id_intermediario: currentData.solicitante?.id_intermediario ? parseInt(String(currentData.solicitante.id_intermediario), 10) : null,
        id_sucursal: currentData.solicitante?.id_sucursal ? Number(currentData.solicitante.id_sucursal) : null,
        nom_intermediario: currentData.solicitante?.nom_intermediario || null,
      },
      vehiculo: currentData.vehiculo,
      coberturas: currentData.coberturas ?? [],
      opcionales: currentData.opcionales ?? [],
      observaciones: currentData.observaciones,
      condiciones: currentData.condiciones,
      status: status,
      nro_version: currentData.nro_version
    };

    if (isEditing) {
      actualizarSolicitud(
        { id: Number(id), payload },
        {
          onSuccess: () => {
            setSuccessId(Number(id));
            reset();
            toastSuccess(`${status === 1 ? 'Cotización' : 'Borrador'} #${id} actualizado con éxito`);
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.message || 'Ocurrió un error al actualizar la cotización.';
            toastError(msg);
          }
        }
      );
    } else {
      createSolicitud(payload as SolicitudPayload, {
        onSuccess: (res) => {
          setSuccessId(res.id_solicitud);
          reset();
          toastSuccess(`${status === 1 ? 'Cotización' : 'Borrador'} #${res.id_solicitud} generado con éxito`);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Ocurrió un error al generar la cotización.';
          toastError(msg);
        },
      });
    }
  };

  // --- Success screen ---
  if (successId) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-5xl mx-auto text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#003366] mb-2">¡Cotización Generada!</h2>
        <p className="text-slate-500 mb-1">Su solicitud fue registrada exitosamente.</p>
        <p className="text-slate-500 mb-6">
          Número de solicitud: <span className="font-bold text-[#003366]">#{successId}</span>
        </p>
        <button
          onClick={() => setSuccessId(null)}
          className="px-8 py-2 bg-[#003366] text-white font-bold rounded shadow-md hover:bg-blue-900 transition-all uppercase text-sm tracking-wider"
        >
          Nueva Cotización
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 md:p-8 rounded-xl shadow-lg border border-slate-200 max-w-5xl mx-auto">
      {/* Encabezado Estilo Excel */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-[#003366] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#cc0000]">BORRADOR</h1>
          <p className="text-xs font-semibold text-slate-600">
            RESPONSABILIDAD CIVIL PARA EL TRANSPORTADOR POR CARRETERA EN VIAJE INTERNACIONAL ENTRE LA REPÚBLICA DE COLOMBIA Y LA REPÚBLICA BOLIVARIANA DE VENEZUELA
          </p>
        </div>
        <div className="text-right flex items-center gap-4">
          <p className="text-sm font-bold">Fecha de Solicitud: {new Date().toLocaleDateString()}</p>
          {/* Opcional: El boton de generar puede ir solo abajo o en ambos lados */}
        </div>
      </div>

      {/* Pasos Visuales */}
      <div className="flex items-center justify-center gap-8 mb-8">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${step >= s.num ? "bg-[#003366] text-white" : "bg-slate-200 text-slate-500"
              }`}>
              {s.num}
            </span>
            <span className={`text-sm font-semibold ${step === s.num ? "text-[#003366]" : "text-slate-400"
              }`}>
              {s.title}
            </span>
            {idx < steps.length - 1 && <span className="text-slate-300 ml-4">&rarr;</span>}
          </div>
        ))}
      </div>

      {/* Contenido del Paso */}
      <div className="min-h-[400px] border border-slate-100 rounded-lg bg-white p-4 overflow-visible">
        {renderStep()}
      </div>

      {/* Navegación */}
      <div className="mt-8 flex justify-between items-center border-t pt-4">
        <div>
          <button
            onClick={() => handleFinalize(0)}
            disabled={isSubmitting}
            className="px-6 py-2 bg-yellow-500 text-white font-bold rounded shadow-md hover:bg-yellow-600 transition-all uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Emitir Borrador
          </button>
        </div>
        <div className="flex gap-4">

          {step > 1 && (
            <button
              onClick={() => {
                if (step === 2 && vehicleFormRef.current?.savePartial) {
                    vehicleFormRef.current.savePartial();
                }
                setStep(Math.max(1, step - 1));
              }}
              className="px-12 py-2 bg-[#003366] text-white font-bold rounded shadow-md hover:bg-blue-900 transition-all uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Volver
            </button>
          )}
          <button
            onClick={() => {
              if (step < 3) {
                handleNextStep();
              } else {
                handleFinalize(1);
              }
            }}
            disabled={isSubmitting}
            className="px-8 py-2 bg-[#003366] text-white font-bold rounded shadow-md hover:bg-blue-900 transition-all uppercase text-sm tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Procesando...' : step === 3 ? 'Generar Cotización' : 'Siguiente Paso'}
          </button>
        </div>
      </div>
    </div>
  );
};

