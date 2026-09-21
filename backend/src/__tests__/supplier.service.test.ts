import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockPrisma } from './mocks';

vi.mock('../config/database', () => ({ prisma: mockPrisma }));

const mockSupplier = {
  id: 'uuid-supplier-1',
  name: 'Tech Corp',
  email: 'tech@corp.com',
  phone: '555-0100',
  address: '123 Main St',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('SupplierService', () => {
  let supplierService: any;
  let mod: typeof import('../services/supplier.service');

  beforeEach(async () => {
    vi.clearAllMocks();
    mod = await import('../services/supplier.service');
    supplierService = new mod.SupplierService();
  });

  describe('create', () => {
    it('crea un proveedor', async () => {
      mockPrisma.supplier.create.mockResolvedValue(mockSupplier);

      const result = await supplierService.create({
        name: 'Tech Corp',
        email: 'tech@corp.com',
      });

      expect(result.name).toBe('Tech Corp');
      expect(mockPrisma.supplier.create).toHaveBeenCalledWith({
        data: { name: 'Tech Corp', email: 'tech@corp.com' },
      });
    });
  });

  describe('findAll', () => {
    it('retorna proveedores paginados', async () => {
      mockPrisma.supplier.findMany.mockResolvedValue([mockSupplier]);
      mockPrisma.supplier.count.mockResolvedValue(1);

      const result = await supplierService.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('filtra por búsqueda', async () => {
      mockPrisma.supplier.findMany.mockResolvedValue([mockSupplier]);
      mockPrisma.supplier.count.mockResolvedValue(1);

      await supplierService.findAll(1, 10, 'tech');

      expect(mockPrisma.supplier.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'tech', mode: 'insensitive' } },
              { email: { contains: 'tech', mode: 'insensitive' } },
            ],
          },
        })
      );
    });
  });

  describe('findById', () => {
    it('retorna proveedor por ID', async () => {
      mockPrisma.supplier.findUnique.mockResolvedValue({
        ...mockSupplier,
        _count: { products: 5 },
      });

      const result = await supplierService.findById('uuid-supplier-1');

      expect(result.id).toBe('uuid-supplier-1');
    });

    it('lanza error si no existe', async () => {
      mockPrisma.supplier.findUnique.mockResolvedValue(null);

      await expect(
        supplierService.findById('nonexistent-id')
      ).rejects.toThrow('Proveedor no encontrado');
    });
  });

  describe('deactivate', () => {
    it('desactiva un proveedor activo', async () => {
      mockPrisma.supplier.findUnique.mockResolvedValue({
        ...mockSupplier,
        _count: { products: 0 },
      });
      mockPrisma.supplier.update.mockResolvedValue({
        ...mockSupplier,
        active: false,
      });

      const result = await supplierService.deactivate('uuid-supplier-1');

      expect(result.active).toBe(false);
    });

    it('lanza error si ya está desactivado', async () => {
      mockPrisma.supplier.findUnique.mockResolvedValue({
        ...mockSupplier,
        active: false,
        _count: { products: 0 },
      });

      await expect(
        supplierService.deactivate('uuid-supplier-1')
      ).rejects.toThrow('El proveedor ya está desactivado');
    });
  });
});
