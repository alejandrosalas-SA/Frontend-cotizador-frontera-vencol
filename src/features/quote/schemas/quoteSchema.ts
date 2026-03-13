import { z } from 'zod';

export const applicantSchema = z.object({
    tipo_persona: z.enum(['N', 'J'], {
        message: 'El tipo de persona es requerido',
    }),
    solicitante: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    id_sucursal: z.number({
        message: 'La sucursal es requerida',
    }),
    id_intermediario: z.union([z.number(), z.string().regex(/^\d+$/, 'Debe ser un número')]),
    nom_intermediario: z.string().min(3, 'El nombre del intermediario es requerido'),
});

export type ApplicantFormData = z.infer<typeof applicantSchema>;

export const vehicleSchema = z.object({
    marca: z.string("La marca es requerida").min(1, 'La marca es requerida'),
    modelo: z.string("El modelo es requerido").min(1, 'El modelo es requerido'),
    anho: z.coerce.number('El año es requerido').int().min(1900, { message: 'El año debe ser mayor a 1900' }).max(new Date().getFullYear() + 1, { message: 'No puede ser un año mayor al actual' }),
    placa: z.string("La placa es requerida").min(1, 'La placa es requerida').toUpperCase(),
    nro_puesto: z.coerce.number({ message: 'El número de puestos es requerido' }).int().positive('Número de puestos inválido'),
    duracion: z.number({ message: 'La duración es requerida' }),
    tipo_exceso: z.number({ message: 'El tipo de exceso es requerido' }).optional().nullable(),
    tipo_vehiculo: z.number({ message: 'El tipo de vehículo es requerido' }).nullable(),
    tasacion_especial: z.number({ message: 'La tasación especial es requerida' }).nullable().optional(),
    autorizado_nombre: z.string().optional().or(z.literal('')),
    autorizado_sucursal: z.number().optional().nullable(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
