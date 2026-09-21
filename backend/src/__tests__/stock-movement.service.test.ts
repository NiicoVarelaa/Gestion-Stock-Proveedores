import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockPrisma } from './mocks';

vi.mock('../config/database', () => ({ prisma: mockPrisma }));

const mockProduct = {
  id: 'uuid-product-1',
  name: 'iPhone 15',
  category: 'Smartphones',
  stock: 50,
  minStock: 5,
  price: 999.99,
  supplierId: 'uuid-supplier-1',
};

const mockMovement = {
  id: 'uuid-movement-1',
  type: 'IN' as const,
  quantity: 10,
  reason: 'Restock',
  productId: 'uuid-product-1',
  createdAt: new Date(),
};

describe('StockMovementService', () => {
  let movementService: any;
  let mod: typeof import('../services/stock-movement.service');

  beforeEach(async () => {
    vi.clearAllMocks();
    mod = await import('../services/stock-movement.service');
    movementService = new mod.StockMovementService();
  });

  describe('create', () => {
    it('crea movimiento IN y aumenta stock', async () => {
      const txMock = {
        product: { findUnique: vi.fn().mockResolvedValue(mockProduct) },
        stockMovement: { create: vi.fn().mockResolvedValue(mockMovement) },
        productUpdate: vi.fn().mockResolvedValue({ ...mockProduct, stock: 60 }),
      };

      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: { findUnique: txMock.product.findUnique },
          stockMovement: { create: txMock.stockMovement.create },
          product: {
            findUnique: txMock.product.findUnique,
            update: vi.fn().mockResolvedValue({ ...mockProduct, stock: 60 }),
          },
        };
        return fn(tx);
      });

      const result = await movementService.create({
        type: 'IN',
        quantity: 10,
        productId: 'uuid-product-1',
      });

      expect(result).toBeDefined();
    });

    it('lanza error si stock insuficiente para OUT', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: {
            findUnique: vi.fn().mockResolvedValue({ ...mockProduct, stock: 5 }),
            update: vi.fn(),
          },
          stockMovement: { create: vi.fn() },
        };
        return fn(tx);
      });

      await expect(
        movementService.create({
          type: 'OUT',
          quantity: 10,
          productId: 'uuid-product-1',
        })
      ).rejects.toThrow('Stock insuficiente');
    });

    it('lanza error si producto no existe', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: any) => {
        const tx = {
          product: {
            findUnique: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
          },
          stockMovement: { create: vi.fn() },
        };
        return fn(tx);
      });

      await expect(
        movementService.create({
          type: 'IN',
          quantity: 10,
          productId: 'nonexistent',
        })
      ).rejects.toThrow('Producto no encontrado');
    });
  });

  describe('findAll', () => {
    it('retorna movimientos paginados', async () => {
      mockPrisma.stockMovement.findMany.mockResolvedValue([mockMovement]);
      mockPrisma.stockMovement.count.mockResolvedValue(1);

      const result = await movementService.findAll(1, 10, {});

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('filtra por tipo', async () => {
      mockPrisma.stockMovement.findMany.mockResolvedValue([]);
      mockPrisma.stockMovement.count.mockResolvedValue(0);

      await movementService.findAll(1, 10, { type: 'IN' });

      expect(mockPrisma.stockMovement.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'IN' }),
        })
      );
    });
  });

  describe('findById', () => {
    it('retorna movimiento por ID', async () => {
      mockPrisma.stockMovement.findUnique.mockResolvedValue({
        ...mockMovement,
        product: { ...mockProduct, supplier: { name: 'Tech Corp' } },
      });

      const result = await movementService.findById('uuid-movement-1');

      expect(result.id).toBe('uuid-movement-1');
    });

    it('lanza error si no existe', async () => {
      mockPrisma.stockMovement.findUnique.mockResolvedValue(null);

      await expect(
        movementService.findById('nonexistent')
      ).rejects.toThrow('Movimiento no encontrado');
    });
  });
});
