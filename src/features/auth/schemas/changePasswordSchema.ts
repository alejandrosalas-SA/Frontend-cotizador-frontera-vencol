import { z } from 'zod';

export const changePasswordSchema = z
    .object({
        Email: z
            .string()
            .min(1, 'El correo electrónico es requerido')
            .email('Formato de correo electrónico inválido'),
        PasswordOld: z
            .string()
            .min(1, 'La contraseña actual es requerida'),
        PasswordNew: z
            .string()
            .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            ),
        PasswordConfirm: z
            .string()
            .min(1, 'Debe confirmar la nueva contraseña'),
    })
    .refine((data) => data.PasswordNew === data.PasswordConfirm, {
        message: 'Las contraseñas no coinciden',
        path: ['PasswordConfirm'],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
