import { z } from 'zod';

export const createMovementSchema = z.object({
  body: z.object({
    type: z.enum(['IN', 'OUT'], { message: 'Tipo debe ser IN o OUT' }),
    quantity: z.coerce.number().int().positive('La cantidad debe ser mayor a 0'),
    productId: z.string().uuid('ID de producto inválido'),
    reason: z.string().optional().or(z.literal('')),
  }),
});

export const getMovementSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

export const listMovementsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    productId: z.string().uuid().optional(),
    type: z.enum(['IN', 'OUT']).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    supplierId: z.string().uuid().optional(),
    category: z.string().optional(),
  }),
});

export type CreateMovementInput = z.infer<typeof createMovementSchema>['body'];
