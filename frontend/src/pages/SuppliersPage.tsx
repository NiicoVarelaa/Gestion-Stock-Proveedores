import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupplierStore } from '@/store/supplier.store';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Supplier } from '@/types';

const supplierSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof supplierSchema>;

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-40 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-5 w-14 bg-gray-200 rounded animate-pulse" /></TableCell>
          <TableCell><div className="h-8 w-16 bg-gray-200 rounded animate-pulse ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function SuppliersPage() {
  const { suppliers, loading, fetchSuppliers, createSupplier, updateSupplier, deactivateSupplier } = useSupplierStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: '', email: '', phone: '', address: '' },
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpen = (supplier?: Supplier) => {
    if (supplier) {
      setEditing(supplier);
      form.reset({ name: supplier.name, email: supplier.email, phone: supplier.phone || '', address: supplier.address || '' });
    } else {
      setEditing(null);
      form.reset({ name: '', email: '', phone: '', address: '' });
    }
    setOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editing) {
        await updateSupplier(editing.id, data);
        toast.success('Proveedor actualizado');
      } else {
        await createSupplier(data);
        toast.success('Proveedor creado');
      }
      setOpen(false);
    } catch {
      toast.error('Error al guardar proveedor');
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este proveedor?')) return;
    try {
      await deactivateSupplier(id);
      toast.success('Proveedor desactivado');
    } catch {
      toast.error('Error al desactivar proveedor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input {...form.register('name')} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register('email')} type="email" />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input {...form.register('phone')} />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input {...form.register('address')} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {editing ? 'Actualizar' : 'Crear'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No hay proveedores registrados
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.active ? 'default' : 'destructive'}>
                      {supplier.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(supplier)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {supplier.active && (
                        <Button variant="ghost" size="icon" onClick={() => handleDeactivate(supplier.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
