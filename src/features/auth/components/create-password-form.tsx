import { useState } from 'react';
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
import { Loader2, Eye, EyeOff } from 'lucide-react';

const strengthLevels = [
  { score: 1, label: 'Muy débil', color: 'bg-red-500' },
  { score: 2, label: 'Débil', color: 'bg-orange-400' },
  { score: 3, label: 'Aceptable', color: 'bg-yellow-500' },
  { score: 4, label: 'Fuerte ✓', color: 'bg-green-500' },
];

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const watchPassword = form.watch('password');
    const strengthScore = [
        watchPassword?.length >= 8,
        /[A-Z]/.test(watchPassword || ''),
        /[a-z]/.test(watchPassword || ''),
        /\d/.test(watchPassword || ''),
    ].filter(Boolean).length;
    const currentStrength = strengthLevels.find((l) => l.score === strengthScore);

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
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10 ${form.formState.errors.password ? 'border-destructive' : 'border-input'
                                                }`}
                                            disabled={createPasswordMutation.isPending}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                {watchPassword && (
                                    <div className="mt-2 text-left">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= strengthScore
                                                            ? (currentStrength?.color ?? 'bg-secondary')
                                                            : 'bg-secondary'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {currentStrength && (
                                            <p className={`text-xs font-medium ${strengthScore === 4 ? 'text-green-600'
                                                    : strengthScore === 3 ? 'text-yellow-600'
                                                        : 'text-red-500'
                                                }`}>
                                                {currentStrength.label} — mín. 8 chars, mayúscula, minúscula y número
                                            </p>
                                        )}
                                    </div>
                                )}
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
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...field}
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-10 ${form.formState.errors.confirmPassword ? 'border-destructive' : 'border-input'
                                                }`}
                                            disabled={createPasswordMutation.isPending}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
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
