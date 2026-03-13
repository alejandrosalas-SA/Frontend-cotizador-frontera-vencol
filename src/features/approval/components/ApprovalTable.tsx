import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export const ApprovalTable = () => {
  const queryClient = useQueryClient();
  
  // GET solicitudes pendientes
  const { data: solicitudes } = useQuery({
    queryKey: ['solicitudes-pendientes'],
    queryFn: () => api.get('/Solicitudes?status=0').then(res => res.data)
  });

  // PUT cambiar estado
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: number }) => 
      api.put(`/Solicitudes/${id}/Status`, { status, id_usuario: 99 }), // ID usuario real
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes-pendientes'] });
    }
  });

  return (
    <div className="rounded-md border">
      {/* Renderizar tabla shadcn aquí */}
      {solicitudes?.map((sol: any) => (
        <div key={sol.id} className="flex justify-between p-4 border-b">
           <span>{sol.placa} - {sol.cliente}</span>
           <div className="gap-2 flex">
             <Button 
               variant="default" // Azul (Aprobar)
               onClick={() => mutation.mutate({ id: sol.id, status: 1 })}
             >Aprobar</Button>
             <Button 
               variant="destructive" // Rojo (Rechazar)
               onClick={() => mutation.mutate({ id: sol.id, status: 2 })}
             >Rechazar</Button>
           </div>
        </div>
      ))}
    </div>
  );
};