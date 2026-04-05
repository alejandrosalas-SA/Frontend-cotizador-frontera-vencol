import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { changePasswordSchema, type ChangePasswordFormData } from '../schemas/changePasswordSchema';
import { useChangePassword } from '../hooks/useChangePassword';
import { useAuthStore } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const strengthLevels = [
  { score: 1, label: 'Muy débil', color: 'bg-red-500' },
  { score: 2, label: 'Débil', color: 'bg-orange-400' },
  { score: 3, label: 'Aceptable', color: 'bg-yellow-500' },
  { score: 4, label: 'Fuerte ✓', color: 'bg-green-500' },
];

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

  const strengthScore = [
    newPassword?.length >= 8,
    /[A-Z]/.test(newPassword || ''),
    /[a-z]/.test(newPassword || ''),
    /\d/.test(newPassword || ''),
  ].filter(Boolean).length;

  const currentStrength = strengthLevels.find((l) => l.score === strengthScore);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-400 hover:text-[#003366] mb-4 transition-colors text-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
        Volver
      </button>

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">¡Contraseña actualizada exitosamente!</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('Email')}
            readOnly={!!user}
            className={`w-full px-3 py-2 text-sm border rounded-md transition-all ${
              user
                ? 'bg-secondary text-muted-foreground cursor-not-allowed border-border'
                : 'bg-white text-foreground border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none'
            }`}
          />
        </div>

        {/* Contraseña actual */}
        <div>
          <label htmlFor="passwordOld" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Contraseña Actual
          </label>
          <input
            id="passwordOld"
            type="password"
            {...register('PasswordOld')}
            placeholder="••••••••"
            className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
              errors.PasswordOld ? 'border-destructive' : 'border-input'
            }`}
            disabled={changePasswordMutation.isPending}
          />
          {errors.PasswordOld && (
            <p className="mt-1 text-xs text-red-600">{errors.PasswordOld.message}</p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label htmlFor="passwordNew" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Nueva Contraseña
          </label>
          <input
            id="passwordNew"
            type="password"
            {...register('PasswordNew')}
            placeholder="••••••••"
            className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
              errors.PasswordNew ? 'border-destructive' : 'border-input'
            }`}
            disabled={changePasswordMutation.isPending}
          />
          {errors.PasswordNew && (
            <p className="mt-1 text-xs text-red-600">{errors.PasswordNew.message}</p>
          )}

          {/* Barra de fortaleza compacta */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      level <= strengthScore
                        ? (currentStrength?.color ?? 'bg-secondary')
                        : 'bg-secondary'
                    }`}
                  />
                ))}
              </div>
              {currentStrength && (
                <p className={`text-xs font-medium ${
                  strengthScore === 4 ? 'text-green-600'
                  : strengthScore === 3 ? 'text-yellow-600'
                  : 'text-red-500'
                }`}>
                  {currentStrength.label} — mín. 8 chars, mayúscula, minúscula y número
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Confirmar Nueva Contraseña
          </label>
          <input
            id="passwordConfirm"
            type="password"
            {...register('PasswordConfirm')}
            placeholder="••••••••"
            className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
              errors.PasswordConfirm ? 'border-destructive' : 'border-input'
            }`}
            disabled={changePasswordMutation.isPending}
          />
          {errors.PasswordConfirm && (
            <p className="mt-1 text-xs text-red-600">{errors.PasswordConfirm.message}</p>
          )}
        </div>

        {/* Botón submit */}
        <div className="pt-2">
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
  );
};
