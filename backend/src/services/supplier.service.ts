import { prisma } from '../config/database';
import { NotFoundError, BusinessError } from '../utils/errors';
import type { CreateSupplierInput, UpdateSupplierInput } from '../routes/supplier.schema';

export class SupplierService {
  async create(data: CreateSupplierInput) {
    return prisma.supplier.create({ data });
  }

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.supplier.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.supplier.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!supplier) throw new NotFoundError('Proveedor no encontrado');
    return supplier;
  }

  async update(id: string, data: UpdateSupplierInput) {
    await this.findById(id);
    return prisma.supplier.update({ where: { id }, data });
  }

  async deactivate(id: string) {
    const supplier = await this.findById(id);
    if (!supplier.active) throw new BusinessError('El proveedor ya está desactivado');
    return prisma.supplier.update({ where: { id }, data: { active: false } });
  }
}
