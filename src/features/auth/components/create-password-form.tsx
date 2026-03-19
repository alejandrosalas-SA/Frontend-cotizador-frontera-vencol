import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useCreatePassword } from '../hooks/useCreatePassword';
import { Loader2 } from 'lucide-react';

const createPasswordSchema = z
    .object({
        email: z.string().email('Ingrese un correo válido'),
        password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;

export const CreatePasswordForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const createPasswordMutation = useCreatePassword();

    // Pre-open email from URL if available, but allow user to edit/confirm
    const emailFromUrl = searchParams.get('email') || '';

    const form = useForm<CreatePasswordFormValues>({
        resolver: zodResolver(createPasswordSchema),
        defaultValues: {
            email: emailFromUrl,
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: CreatePasswordFormValues) => {
        const token = searchParams.get('token');

        createPasswordMutation.mutate({
            Email: data.email,
            Password: data.password,
            Token: token || undefined,
        }, {
            onSuccess: () => {
                navigate('/auth/login');
            }
        });
    };

    return (
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <label htmlFor="email" className="block text-md font-medium text-slate-700 mb-1.5 text-left">
                                    Correo Electrónico Empresarial
                                </label>
                                <FormControl>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="usuario@segurosaltamira.com"
                                        {...field}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${form.formState.errors.email ? 'border-destructive' : 'border-input'
                                            }`}
                                        disabled={createPasswordMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <label htmlFor="password" className="block text-md font-medium text-slate-700 mb-1.5 text-left">
                                    Nueva Contraseña
                                </label>
                                <FormControl>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${form.formState.errors.password ? 'border-destructive' : 'border-input'
                                            }`}
                                        disabled={createPasswordMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <label htmlFor="confirmPassword" className="block text-md font-medium text-slate-700 mb-1.5 text-left">
                                    Confirmar Contraseña
                                </label>
                                <FormControl>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${form.formState.errors.confirmPassword ? 'border-destructive' : 'border-input'
                                            }`}
                                        disabled={createPasswordMutation.isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-10 text-lg"
                        disabled={createPasswordMutation.isPending}
                    >
                        {createPasswordMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creando contraseña...
                            </>
                        ) : (
                            'Crear Contraseña'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
