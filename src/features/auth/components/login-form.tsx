import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';
import { Loader2 } from 'lucide-react';

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-md font-medium text-slate-700 mb-1.5 text-left">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          {...register('Email')}
          placeholder="usuario@segurosaltamira.com"
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.Email ? 'border-destructive' : 'border-input'
            }`}
          disabled={loginMutation.isPending}
        />
        {errors.Email && (
          <p className="mt-1 text-xs text-destructive">{errors.Email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-md font-medium text-slate-700 mb-1.5 text-left">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('Password')}
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.Password ? 'border-destructive' : 'border-input'
            }`}
          disabled={loginMutation.isPending}
        />
        {errors.Password && (
          <p className="mt-1 text-xs text-destructive">{errors.Password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="text-lg w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Ingresar'
        )}
      </Button>
    </form>
  );
};