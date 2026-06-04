import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, BusinessError } from '../utils/errors';
import type { CreateProductInput, UpdateProductInput } from '../routes/product.schema';

export class ProductService {
  async create(data: CreateProductInput) {
    const supplier = await prisma.supplier.findUnique({ where: { id: data.supplierId } });
    if (!supplier) throw new NotFoundError('Proveedor no encontrado');
    if (!supplier.active) throw new BusinessError('El proveedor está desactivado');

    return prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        price: new Prisma.Decimal(data.price.toString()),
        minStock: data.minStock,
        supplierId: data.supplierId,
      },
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  async findAll(page: number, limit: number, filters: { category?: string; supplierId?: string; search?: string }) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (filters.category) where.category = filters.category;
    if (filters.supplierId) where.supplierId = filters.supplierId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' as const } },
        { category: { contains: filters.search, mode: 'insensitive' as const } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { supplier: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { supplier: true, _count: { select: { movements: true } } },
    });

    if (!product) throw new NotFoundError('Producto no encontrado');
    return product;
  }

  async update(id: string, data: UpdateProductInput) {
    await this.findById(id);

    if (data.supplierId) {
      const supplier = await prisma.supplier.findUnique({ where: { id: data.supplierId } });
      if (!supplier) throw new NotFoundError('Proveedor no encontrado');
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price.toString());
    if (data.minStock !== undefined) updateData.minStock = data.minStock;
    if (data.supplierId !== undefined) updateData.supplierId = data.supplierId;

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: { supplier: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return prisma.product.delete({ where: { id } });
  }

  async getLowStock() {
    return prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.minStock },
      },
      include: { supplier: { select: { id: true, name: true, email: true } } },
      orderBy: { stock: 'asc' },
    });
  }
}
