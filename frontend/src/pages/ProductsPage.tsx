import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/product.store';
import { useSupplierStore } from '@/store/supplier.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormFieldError } from '@/components/FormFieldError';
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
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.string().min(1, 'La categoría es requerida'),
  price: z.coerce.number().positive('El precio debe ser positivo'),
  minStock: z.coerce.number().int().nonnegative(),
  supplierId: z.string().uuid('Proveedor inválido'),
});

type FormData = z.infer<typeof productSchema>;

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-5 w-10 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-8 w-16 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ProductsPage() {
  const { products, total, loading, fetchProducts, fetchLowStock, createProduct, updateProduct, deleteProduct } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const limit = 10;

  const form = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', category: '', price: 0, minStock: 5, supplierId: '' },
  });

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  const loadData = () => {
    fetchProducts({
      page,
      limit,
      search: search || undefined,
      category: category || undefined,
    });
  };

  useEffect(() => {
    loadData();
    fetchLowStock();
    fetchSuppliers({ limit: 100 });
  }, [page, search, category]);

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditing(product);
      form.reset({
        name: product.name,
        category: product.category,
        price: Number(product.price),
        minStock: product.minStock,
        supplierId: product.supplierId,
      });
    } else {
      setEditing(null);
      form.reset({ name: '', category: '', price: 0, minStock: 5, supplierId: '' });
    }
    setOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateProduct(editing.id, data);
        toast.success('Producto actualizado');
      } else {
        await createProduct(data);
        toast.success('Producto creado');
      }
      setOpen(false);
      loadData();
    } catch {
      toast.error('Error al guardar producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado');
      loadData();
    } catch {
      toast.error('Error al eliminar producto');
    }
  };

  const isLowStock = useMemo(
    () => (product: Product) => product.stock <= product.minStock,
    []
  );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} key={editing?.id || 'new'} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input {...form.register('name')} />
                <FormFieldError error={form.formState.errors.name} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input {...form.register('category')} />
                <FormFieldError error={form.formState.errors.category} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio</Label>
                  <Input {...form.register('price')} type="number" step="0.01" />
                  <FormFieldError error={form.formState.errors.price} />
                </div>
                <div className="space-y-2">
                  <Label>Stock Mínimo</Label>
                  <Input {...form.register('minStock')} type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Select
                  value={form.watch('supplierId')}
                  onValueChange={(value: string) => form.setValue('supplierId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers
                      .filter((s) => s.active)
                      .map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={form.formState.errors.supplierId} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {editing ? 'Actualizar' : 'Crear'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No hay productos registrados
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const low = isLowStock(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={low ? 'destructive' : 'secondary'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.supplier.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpen(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {products.length} de {total} productos
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
