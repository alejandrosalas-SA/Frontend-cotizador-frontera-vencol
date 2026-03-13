import { z } from 'zod';

export const loginSchema = z.object({
    Email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('Formato de correo electrónico inválido'),
    Password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
