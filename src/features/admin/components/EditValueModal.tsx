import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  value: z
    .number({ message: 'Debe ser un número válido' })
    .min(0, 'El valor debe ser mayor o igual a 0'),
});

type FormValues = z.infer<typeof schema>;

interface EditValueModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  label: string;
  currentValue: number;
  isLoading: boolean;
  onSubmit: (value: number) => void;
}

export const EditValueModal = ({
  open,
  onOpenChange,
  title,
  label,
  currentValue,
  isLoading,
  onSubmit,
}: EditValueModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { value: currentValue },
  });

  useEffect(() => {
    reset({ value: currentValue });
  }, [currentValue, reset]);

  const handleFormSubmit = (data: FormValues) => {
    onSubmit(data.value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-value">{label}</Label>
            <Input
              id="edit-value"
              type="decimal"
              step="1.000"
              min="0"
              placeholder="0"
              {...register('value', { valueAsNumber: true })}
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
