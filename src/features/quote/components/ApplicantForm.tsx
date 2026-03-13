import { forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { useQuoteStore } from '../store/quoteStore';
import { applicantSchema, type ApplicantFormData } from '../schemas/quoteSchema';
import { useSucursales, useIntermediarios } from '../hooks/useMaestros';

interface ApplicantFormProps {
    initialValues?: Record<string, any> | undefined;
}

export const ApplicantForm = forwardRef(({ initialValues }: ApplicantFormProps, ref) => {
    const { updateData } = useQuoteStore();
    const { data: sucursales = [], isLoading: isLoadingSucursales } = useSucursales();
    const { data: intermediarios = [], isLoading: isLoadingIntermediarios } = useIntermediarios();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<ApplicantFormData>({
        resolver: zodResolver(applicantSchema),
        defaultValues: {
            tipo_persona: 'N',
            solicitante: '',
            email: '',
        },
        // → react-hook-form v7+: `values` se sincroniza automáticamente cuando cambia.
        // Cuando `initialValues` es undefined (nueva cotización), no hace nada.
        // Cuando llega el borrador (asychronamente), hidrata el form sin useEffect ni reset().
        values: initialValues as ApplicantFormData | undefined,
        resetOptions: {
            keepDirtyValues: true, // preserva ediciones del usuario si devuelve al paso
        },
        mode: 'onTouched'
    });

    // Hydratación: manejada reactivamente por la propiedad `values` de useForm.

    // Exponer el método handleSubmit al padre
    useImperativeHandle(ref, () => ({
        submitForm: async () => {
            let result = false;
            await handleSubmit((formData) => {
                updateData('solicitante', formData);
                result = true;
            })();
            return result;
        },
        savePartial: () => {
            // Guarda los valores actuales sin importar si hay errores de validacion Zod
            const currentData = control._formValues;
            updateData('solicitante', currentData as any);
        }
    }));

    // Sincronizacion removida en favor de submitForm al pasar al siguiente paso

    const personaOptions = [
        { value: 'N', label: 'Natural' },
        { value: 'J', label: 'Jurídico' }
    ];

    const sucursalOptions = sucursales.map(s => ({ value: s.id, label: s.nombre }));
    const codeOptions = intermediarios.map(i => ({ value: String(i.id), label: String(i.id) }));
    const nameOptions = intermediarios.map(i => ({ value: String(i.id), label: i.nombre }));

    const selectStyles = (hasError: boolean) => ({
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
        <form className="space-y-6">
            <div className="bg-[#003366] text-white py-2 px-4 font-bold text-center mb-6">
                Datos del Solicitante
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 px-4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">Solicitante</label>
                    <input
                        {...register('solicitante')}
                        className={`border-b border-slate-400 focus:border-[#003366] outline-none py-1 text-sm bg-transparent ${errors.solicitante ? 'border-red-500' : ''}`}
                        placeholder="Nombre completo"
                    />
                    {errors.solicitante && <span className="text-red-500 text-xs mt-1">{errors.solicitante.message}</span>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">Tipo de Persona</label>
                    <Controller
                        name="tipo_persona"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={personaOptions}
                                className="text-sm"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                value={personaOptions.find(o => o.value === field.value) || null}
                                onChange={(val) => field.onChange(val?.value)}
                                styles={selectStyles(!!errors.tipo_persona)}
                            />
                        )}
                    />
                    {errors.tipo_persona && <span className="text-red-500 text-xs mt-1">{errors.tipo_persona.message}</span>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">Correo</label>
                    <input
                        type="email"
                        {...register('email')}
                        className={`border-b border-slate-400 focus:border-[#003366] outline-none py-1 text-sm bg-transparent ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="ejemplo@correo.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">Sucursal</label>
                    <Controller
                        name="id_sucursal"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isLoading={isLoadingSucursales}
                                options={sucursalOptions}
                                className="text-sm"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                value={sucursalOptions.find(o => o.value === field.value) || null}
                                onChange={(val) => field.onChange(val?.value)}
                                placeholder="Seleccione sucursal..."
                                styles={selectStyles(!!errors.id_sucursal)}
                            />
                        )}
                    />
                    {errors.id_sucursal && <span className="text-red-500 text-xs mt-1">{errors.id_sucursal.message}</span>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">Código Intermediario</label>
                    <Controller
                        name="id_intermediario"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isClearable
                                isLoading={isLoadingIntermediarios}
                                options={codeOptions}
                                className="text-sm"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                value={codeOptions.find(o => o.value === String(field.value)) || null}
                                onChange={(val) => {
                                    field.onChange(val?.value || '');
                                    if (val) {
                                        const rel = intermediarios.find(i => String(i.id) === val.value);
                                        if (rel) setValue('nom_intermediario', rel.nombre, { shouldValidate: true });
                                    } else {
                                        setValue('nom_intermediario', '', { shouldValidate: true });
                                    }
                                }}
                                placeholder="0000"
                                styles={selectStyles(!!errors.id_intermediario)}
                            />
                        )}
                    />
                    {errors.id_intermediario && <span className="text-red-500 text-xs mt-1">{errors.id_intermediario.message}</span>}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-slate-700 mb-1">Nombre Intermediario</label>
                    <Controller
                        name="nom_intermediario"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isClearable
                                isLoading={isLoadingIntermediarios}
                                options={nameOptions}
                                className="text-sm"
                                classNamePrefix="react-select"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                value={nameOptions.find(o => o.label === field.value) || null}
                                onChange={(val) => {
                                    field.onChange(val?.label || '');
                                    if (val) {
                                        setValue('id_intermediario', val.value, { shouldValidate: true });
                                    } else {
                                        setValue('id_intermediario', '', { shouldValidate: true });
                                    }
                                }}
                                placeholder="Nombre del asesor"
                                styles={selectStyles(!!errors.nom_intermediario)}
                            />
                        )}
                    />
                    {errors.nom_intermediario && <span className="text-red-500 text-xs mt-1">{errors.nom_intermediario.message}</span>}
                </div>
            </div>
        </form>
    );
});

