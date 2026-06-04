import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, BusinessError } from '../utils/errors';
import type { CreateMovementInput } from '../routes/stock-movement.schema';

export class StockMovementService {
  async create(data: CreateMovementInput) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: data.productId },
        include: { supplier: { select: { name: true } } },
      });

      if (!product) throw new NotFoundError('Producto no encontrado');

      if (data.type === 'OUT' && product.stock < data.quantity) {
        throw new BusinessError(
          `Stock insuficiente. Stock actual: ${product.stock}, solicitado: ${data.quantity}`
        );
      }

      const newStock = data.type === 'IN'
        ? product.stock + data.quantity
        : product.stock - data.quantity;

      const [movement, updatedProduct] = await Promise.all([
        tx.stockMovement.create({
          data: {
            type: data.type,
            quantity: data.quantity,
            reason: data.reason || null,
            productId: data.productId,
          },
          include: { product: { select: { id: true, name: true } } },
        }),
        tx.product.update({
          where: { id: data.productId },
          data: { stock: newStock },
        }),
      ]);

      return { movement, product: updatedProduct };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  async findAll(page: number, limit: number, filters: {
    productId?: string;
    type?: 'IN' | 'OUT';
    from?: string;
    to?: string;
  }) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (filters.productId) where.productId = filters.productId;
    if (filters.type) where.type = filters.type;
    if (filters.from || filters.to) {
      const dateFilter: Record<string, Date> = {};
      if (filters.from) dateFilter.gte = new Date(filters.from);
      if (filters.to) dateFilter.lte = new Date(filters.to);
      where.createdAt = dateFilter;
    }

    const [data, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        include: { product: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const movement = await prisma.stockMovement.findUnique({
      where: { id },
      include: { product: { include: { supplier: true } } },
    });

    if (!movement) throw new NotFoundError('Movimiento no encontrado');
    return movement;
  }
}
