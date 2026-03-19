import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { useQuoteStore } from '../store/quoteStore';
import { useAuthStore } from '@/stores/auth';
import { vehicleSchema, type VehicleFormData } from '../schemas/quoteSchema';
import {
    useMarcas,
    useModelos,
    useSucursalesUsuario,
    useDuracionesViaje,
    useTiposExceso,
    useTiposTransporte,
    useTasacionesEspeciales
} from '../hooks/useMaestros';

interface VehicleFormProps {
    initialValues?: Record<string, any>;
}

export const VehicleForm = forwardRef(({ initialValues }: VehicleFormProps, ref) => {
    const { updateData } = useQuoteStore();
    const { user } = useAuthStore();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<VehicleFormData>({
        // @ts-ignore: Suppressing Zod coercion type mismatch
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            anho: new Date().getFullYear(),
            nro_puesto: 1,
            marca: '',
            modelo: '',
            placa: '',
            // Pré-rellenar autorizado con el usuario autenticado para nuevas cotizaciones
            autorizado_nombre: user ? `${user.nombre} ${user.apellido}`.trim() : '',
        },
        // → react-hook-form v7+: `values` se sincroniza automáticamente.
        // Si `initialValues` viene del borrador (asíncrono): hidrata el form de una vez.
        // Si es nueva cotización (undefined): los defaultValues se aplican normalmente.
        values: initialValues
            ? {
                ...initialValues,
                // Siempre preferir el nombre del usuario autenticado para el campo autorizado
                autorizado_nombre: user
                    ? `${user.nombre} ${user.apellido}`.trim()
                    : initialValues.autorizado_nombre ?? '',
              } as VehicleFormData
            : undefined,
        resetOptions: {
            keepDirtyValues: true, // preserva ediciones del usuario si regresa al paso
        },
        mode: 'onChange'
    });

    // Hydratación inicial manejada por defaultValues. 
    // Se elimina el useEffect de reset reactivo para evitar que el estado global
    // sobrescriba lo que el usuario está tecleando rápidamente (glitches).

    // Exponer el método handleSubmit al padre
    useImperativeHandle(ref, () => ({
        submitForm: async () => {
            let result = false;
            await handleSubmit((formData) => {
                updateData('vehiculo', formData);
                result = true;
            })();
            return result;
        },
        savePartial: () => {
             // Guarda los valores actuales sin importar si hay errores de validacion Zod
             const currentData = control._formValues;
             updateData('vehiculo', currentData as any);
        }
    }));

    // Se removió el Auto-Sincronizador (watch) para evitar re-renders en el padre
    // Los datos solo se guardan en el store cuando el usuario hace clic en Siguiente (submitForm).

    // Observar variables para reglas de negocio
    const selectedMarca = useWatch({ control, name: 'marca' });
    const selectedTasacion = useWatch({ control, name: 'tasacion_especial' });
    const selectedDuracion = useWatch({ control, name: 'duracion' });

    useEffect(() => {
        if (selectedTasacion) {
            setValue('tipo_vehiculo', null as any, { shouldValidate: true });
            setValue('duracion', 7, { shouldValidate: true });
        }
    }, [selectedTasacion, setValue]);

    useEffect(() => {
        if (selectedDuracion === 1) {
            setValue('tipo_vehiculo', 1, { shouldValidate: true });
        }
    }, [selectedDuracion, setValue]);

    // Carga de maestros con React Query
    const { data: marcas = [], isLoading: isLoadingMarcas } = useMarcas();
    const { data: modelos = [], isLoading: isLoadingModelos } = useModelos(selectedMarca || '');
    const { data: sucursales = [], isLoading: isLoadingSucursales } = useSucursalesUsuario(user?.cod_emp);
    const { data: duraciones = [], isLoading: isLoadingDuraciones } = useDuracionesViaje();
    const { data: excesos = [], isLoading: isLoadingExcesos } = useTiposExceso();
    const { data: transportes = [], isLoading: isLoadingTransportes } = useTiposTransporte();
    const { data: tasaciones = [], isLoading: isLoadingTasaciones } = useTasacionesEspeciales();

    const marcaOptions = marcas.map(m => ({ value: String(m.cod_marca), label: m.marca }));
    const modeloOptions = modelos.map(m => ({ value: String(m.codmodelo), label: m.descmodelo }));
    const sucursalOptions = sucursales.map(s => ({ value: s.id, label: s.nombre }));
    const duracionOptions = duraciones.map(d => ({ value: d.id, label: d.nombre }));
    const excesoOptions = excesos.map(e => ({ value: e.id, label: e.nombre }));
    const transporteOptions = transportes.map(t => ({ value: t.id, label: t.nombre + ' - ' + t?.etiqueta }));
    const tasacionOptions = tasaciones.map(t => ({ value: t.id, label: t.nombre }));

    const selectStyles = (hasError: any) => ({
        control: (base: any) => ({
            ...base,
            border: 'none',
            borderBottom: hasError ? '1px solid #ef4444' : '1px solid #94a3b8',
            borderRadius: 0,
            boxShadow: 'none',
            '&:hover': { borderBottom: '1px solid #003366' },
            minHeight: 'auto',
            backgroundColor: 'transparent'
        }),
        valueContainer: (base: any) => ({ ...base, padding: '2px 0' }),
        indicatorSeparator: () => ({ display: 'none' }),
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
    });

    return (
        <form className="space-y-8">
            {/* Sección: Datos del Vehículo */}
            <div>
                <div className="bg-[#003366] text-white py-2 px-4 font-bold text-center mb-6">
                    Datos del Vehículo
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 px-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Marca</label>
                        <Controller
                            name="marca"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isLoading={isLoadingMarcas}
                                    isClearable
                                    options={marcaOptions}
                                    className="text-sm"
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={marcaOptions.find(o => o.value === String(field.value)) || null}
                                    onChange={(val) => {
                                        field.onChange(val?.value ?? '');
                                        setValue('modelo', '', { shouldValidate: false, shouldDirty: true });
                                    }}
                                    placeholder="Marca..."
                                    styles={selectStyles(errors.marca)}
                                />
                            )}
                        />
                        {errors.marca && <span className="text-red-500 text-xs mt-1">{errors.marca.message}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Modelo</label>
                        <Controller
                            name="modelo"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isClearable
                                    isLoading={isLoadingModelos}
                                    options={modeloOptions}
                                    isDisabled={!selectedMarca}
                                    className="text-sm"
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={modeloOptions.find(o => o.value === String(field.value)) || null}
                                    onChange={(val) => field.onChange(val?.value ?? '')}
                                    placeholder="Modelo..."
                                    styles={selectStyles(errors.modelo)}
                                />
                            )}
                        />
                        {errors.modelo && <span className="text-red-500 text-xs mt-1">{errors.modelo.message}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Año</label>
                        <input
                            type="number"
                            {...register('anho')}
                            className={`border-b border-slate-400 focus:border-[#003366] outline-none py-1 text-sm bg-transparent ${errors.anho ? 'border-red-500' : ''}`}
                            placeholder="2024"
                        />
                        {errors.anho && <span className="text-red-500 text-xs mt-1">{errors.anho.message}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Placa</label>
                        <input
                            {...register('placa')}
                            className={`border-b border-slate-400 focus:border-[#003366] outline-none py-1 text-sm bg-transparent uppercase ${errors.placa ? 'border-red-500' : ''}`}
                            placeholder="ABC-123"
                        />
                        {errors.placa && <span className="text-red-500 text-xs mt-1">{errors.placa.message}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">N° de Puestos</label>
                        <input
                            type="number"
                            min={1}
                            {...register('nro_puesto')}
                            className={`border-b border-slate-400 focus:border-[#003366] outline-none py-1 text-sm bg-transparent ${errors.nro_puesto ? 'border-red-500' : ''}`}
                        />
                        {errors.nro_puesto && <span className="text-red-500 text-xs mt-1">{errors.nro_puesto.message}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Duración del Viaje</label>
                        <Controller
                            name="duracion"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isClearable
                                    isLoading={isLoadingDuraciones}
                                    options={duracionOptions}
                                    isDisabled={!!selectedTasacion}
                                    className={`text-sm ${selectedTasacion ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={duracionOptions.find(o => o.value === field.value) || null}
                                    onChange={(val) => {
                                        field.onChange(val ? val.value : null);
                                        if (val?.value === 1) {
                                            setValue('tipo_vehiculo', 1, { shouldValidate: true });
                                        }
                                    }}
                                    styles={selectStyles(errors.duracion)}
                                />
                            )}
                        />
                        {errors.duracion && <span className="text-red-500 text-xs mt-1">{errors.duracion.message}</span>}
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Exceso</label>
                        <Controller
                            name="tipo_exceso"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isClearable
                                    {...field}
                                    isLoading={isLoadingExcesos}
                                    options={excesoOptions}
                                    className="text-sm"
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={excesoOptions.find(o => o.value === field.value) || null}
                                    onChange={(val) => field.onChange(val ? val.value : null)}
                                    styles={selectStyles(errors.tipo_exceso)}
                                />
                            )}
                        />
                        {errors.tipo_exceso && <span className="text-red-500 text-xs mt-1">{errors.tipo_exceso.message}</span>}
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Tipo de Transporte</label>
                        <Controller
                            name="tipo_vehiculo"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    isClearable
                                    {...field}
                                    isLoading={isLoadingTransportes}
                                    options={transporteOptions}
                                    isDisabled={!!selectedTasacion || selectedDuracion === 1}
                                    className={`text-sm ${selectedTasacion || selectedDuracion === 1 ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={transporteOptions.find(o => o.value === field.value) || null}
                                    onChange={(val) => field.onChange(val ? val.value : null)}
                                    styles={selectStyles(errors.tipo_vehiculo)}
                                />
                            )}
                        />
                        {errors.tipo_vehiculo && <span className="text-red-500 text-xs mt-1">{errors.tipo_vehiculo.message}</span>}
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Tasación Especial</label>
                        <Controller
                            name="tasacion_especial"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isLoading={isLoadingTasaciones}
                                    options={tasacionOptions}
                                    isClearable
                                    className="text-sm"
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={tasacionOptions.find(o => o.value === field.value) || null}
                                    onChange={(val) => field.onChange(val?.value || null)}
                                    styles={selectStyles(errors.tasacion_especial)}
                                />
                            )}
                        />
                        {errors.tasacion_especial && <span className="text-red-500 text-xs mt-1">{errors.tasacion_especial.message}</span>}
                    </div>
                </div>
            </div>

            {/* Sección: Datos Persona Autorizada */}
            <div>
                <div className="bg-[#003366] text-white py-2 px-4 font-bold text-center mb-6">
                    Datos Persona Autorizada para Cotizar
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 px-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Nombre y Apellido</label>
                        <input
                            {...register('autorizado_nombre')}
                            readOnly
                            className="border-b border-slate-400 outline-none py-1 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-slate-700 mb-1">Sucursal</label>
                        <Controller
                            name="autorizado_sucursal"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isClearable
                                    isLoading={isLoadingSucursales}
                                    options={sucursalOptions}
                                    className="text-sm"
                                    classNamePrefix="react-select"
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    value={sucursalOptions.find(o => o.value === field.value) || null}
                                    onChange={(val) => field.onChange(val ? val.value : null)}
                                    styles={selectStyles(errors.autorizado_sucursal)}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
});

