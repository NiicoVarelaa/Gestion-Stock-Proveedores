import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMovementStore } from '@/store/movement.store';
import { useProductStore } from '@/store/product.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';

const movementSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
  productId: z.string().uuid('Producto inválido'),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof movementSchema>;

export default function MovementsPage() {
  const { movements, loading, fetchMovements, createMovement } = useMovementStore();
  const { products, fetchProducts } = useProductStore();
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: { type: 'IN', quantity: 0, productId: '', reason: '' },
  });

  useEffect(() => {
    fetchMovements();
    fetchProducts({ limit: 100 });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createMovement(data);
      toast.success('Movimiento registrado');
      setOpen(false);
      form.reset({ type: 'IN', quantity: 0, productId: '', reason: '' });
    } catch {
      toast.error('Error al registrar movimiento');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Movimientos de Stock</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset({ type: 'IN', quantity: 0, productId: '', reason: '' })}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Movimiento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Movimiento</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value: 'IN' | 'OUT') => form.setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Entrada</SelectItem>
                    <SelectItem value="OUT">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Producto</Label>
                <Select
                  value={form.watch('productId')}
                  onValueChange={(value: string) => form.setValue('productId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.productId && (
                  <p className="text-sm text-red-500">{form.formState.errors.productId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input {...form.register('quantity')} type="number" min="1" />
                {form.formState.errors.quantity && (
                  <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Motivo (opcional)</Label>
                <Input {...form.register('reason')} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Registrar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell className="font-medium">{movement.product.name}</TableCell>
                <TableCell>
                  <Badge variant={movement.type === 'IN' ? 'default' : 'destructive'} className="gap-1">
                    {movement.type === 'IN' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                  </Badge>
                </TableCell>
                <TableCell className={movement.type === 'IN' ? 'text-green-600' : 'text-orange-600'}>
                  {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                </TableCell>
                <TableCell>{movement.reason || '-'}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(movement.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
