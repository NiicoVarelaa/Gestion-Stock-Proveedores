import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    category: z.string().min(1, 'La categoría es requerida'),
    price: z.coerce.number().positive('El precio debe ser positivo'),
    minStock: z.coerce.number().int().nonnegative().default(5),
    supplierId: z.string().uuid('ID de proveedor inválido'),
    imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    price: z.coerce.number().positive().optional(),
    minStock: z.coerce.number().int().nonnegative().optional(),
    supplierId: z.string().uuid().optional(),
    imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')).optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    category: z.string().optional(),
    supplierId: z.string().uuid().optional(),
    search: z.string().optional(),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
