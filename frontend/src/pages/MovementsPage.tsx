import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMovementStore } from '@/store/movement.store';
import { useProductStore } from '@/store/product.store';
import { useSupplierStore } from '@/store/supplier.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFieldError } from '@/components/FormFieldError';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Filter,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

const movementSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
  productId: z.string().uuid('Producto inválido'),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof movementSchema>;

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-5 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-10 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function MovementsPage() {
  const { movements, total, loading, fetchMovements, createMovement } = useMovementStore();
  const { products, fetchProducts } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [supplierFilter, setSupplierFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const limit = 10;

  const categories = [...new Set(products.map((p) => p.category))].sort();

  const form = useForm<FormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: { type: 'IN', quantity: 1, productId: '', reason: '' },
  });

  const loadData = () => {
    fetchMovements({
      page,
      limit,
      type: (typeFilter as 'IN' | 'OUT') || undefined,
      supplierId: supplierFilter || undefined,
      category: categoryFilter || undefined,
    });
  };

  useEffect(() => {
    loadData();
  }, [page, typeFilter, supplierFilter, categoryFilter]);

  useEffect(() => {
    fetchProducts({ limit: 100 });
    fetchSuppliers({ limit: 100 });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createMovement(data);
      toast.success('Movimiento registrado');
      setOpen(false);
      form.reset({ type: 'IN', quantity: 1, productId: '', reason: '' });
      loadData();
    } catch {
      toast.error('Error al registrar movimiento');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Movimientos de Stock</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset({ type: 'IN', quantity: 1, productId: '', reason: '' })}>
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
                    <SelectItem value="IN">
                      <span className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        Entrada
                      </span>
                    </SelectItem>
                    <SelectItem value="OUT">
                      <span className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                        Salida
                      </span>
                    </SelectItem>
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
                <FormFieldError error={form.formState.errors.productId} />
              </div>
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input {...form.register('quantity')} type="number" min="1" />
                <FormFieldError error={form.formState.errors.quantity} />
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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={typeFilter || 'all'} onValueChange={(v) => { setTypeFilter(v === 'all' ? undefined : v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="IN">Entradas</SelectItem>
              <SelectItem value="OUT">Salidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <Select value={supplierFilter || 'all'} onValueChange={(v) => { setSupplierFilter(v === 'all' ? undefined : v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todos los proveedores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proveedores</SelectItem>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={categoryFilter || 'all'} onValueChange={(v) => { setCategoryFilter(v === 'all' ? undefined : v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-md border">
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
            {loading ? (
              <TableSkeleton />
            ) : movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No hay movimientos registrados
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ))
        ) : movements.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay movimientos registrados</p>
        ) : (
          movements.map((movement) => (
            <Card key={movement.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900 flex-1 min-w-0 truncate">{movement.product.name}</p>
                  <Badge variant={movement.type === 'IN' ? 'default' : 'destructive'} className="flex-shrink-0 gap-1">
                    {movement.type === 'IN' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={movement.type === 'IN' ? 'text-lg font-bold text-green-600' : 'text-lg font-bold text-orange-600'}>
                    {movement.type === 'IN' ? '+' : '-'}{movement.quantity} uds
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(movement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {movement.reason && (
                  <p className="mt-2 text-sm text-gray-500">{movement.reason}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Mostrando {movements.length} de {total} movimientos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
