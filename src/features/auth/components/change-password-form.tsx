import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormData } from '../schemas/changePasswordSchema';
import { useChangePassword } from '../hooks/useChangePassword';
import { useAuthStore } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      Email: user?.email || '',
    },
  });

  const changePasswordMutation = useChangePassword();
  const newPassword = watch('PasswordNew');

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        reset({
          Email: user?.email || data.Email,
          PasswordOld: '',
          PasswordNew: '',
          PasswordConfirm: '',
        });
        setTimeout(() => setShowSuccess(false), 5000);
      },
    });
  };

  const passwordStrength = {
    hasMinLength: newPassword?.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword || ''),
    hasLowerCase: /[a-z]/.test(newPassword || ''),
    hasNumber: /\d/.test(newPassword || ''),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-[#003366] mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Cambiar Contraseña</h2>
          <p className="text-slate-500 mt-1">
            Ingresa tus credenciales para actualizar tu acceso al sistema.
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">¡Contraseña actualizada!</p>
              <p className="text-sm text-green-700">Tu contraseña ha sido cambiada exitosamente.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('Email')}
              readOnly={!!user}
              className={`w-full px-4 py-2 border rounded-md transition-all ${user
                ? 'bg-secondary text-muted-foreground cursor-not-allowed border-border'
                : 'bg-white text-foreground border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
                }`}
            />
          </div>

          <div>
            <label htmlFor="passwordOld" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
              Contraseña Actual
            </label>
            <input
              id="passwordOld"
              type="password"
              {...register('PasswordOld')}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.PasswordOld ? 'border-destructive' : 'border-input'
                }`}
              disabled={changePasswordMutation.isPending}
            />
            {errors.PasswordOld && (
              <p className="mt-1.5 text-sm text-red-600">{errors.PasswordOld.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="passwordNew" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
              Nueva Contraseña
            </label>
            <input
              id="passwordNew"
              type="password"
              {...register('PasswordNew')}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.PasswordNew ? 'border-destructive' : 'border-input'
                }`}
              disabled={changePasswordMutation.isPending}
            />
            {errors.PasswordNew && (
              <p className="mt-1.5 text-sm text-red-600">{errors.PasswordNew.message}</p>
            )}

            {newPassword && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${level <= strengthScore
                        ? strengthScore === 4
                          ? 'bg-green-500'
                          : strengthScore === 3
                            ? 'bg-yellow-500'
                            : 'bg-destructive'
                        : 'bg-secondary'
                        }`}
                    />
                  ))}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordStrength.hasMinLength ? 'text-green-700' : 'text-muted-foreground'}>
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasUpperCase ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordStrength.hasUpperCase ? 'text-green-700' : 'text-muted-foreground'}>
                      Una letra mayúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasLowerCase ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordStrength.hasLowerCase ? 'text-green-700' : 'text-muted-foreground'}>
                      Una letra minúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordStrength.hasNumber ? 'text-green-700' : 'text-muted-foreground'}>
                      Un número
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
              Confirmar Nueva Contraseña
            </label>
            <input
              id="passwordConfirm"
              type="password"
              {...register('PasswordConfirm')}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.PasswordConfirm ? 'border-destructive' : 'border-input'
                }`}
              disabled={changePasswordMutation.isPending}
            />
            {errors.PasswordConfirm && (
              <p className="mt-1.5 text-sm text-red-600">{errors.PasswordConfirm.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cambiando contraseña...
                </>
              ) : (
                'Cambiar Contraseña'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
