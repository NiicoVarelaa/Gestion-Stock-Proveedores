import { prisma } from '../config/database';

export class DashboardService {
  async getMetrics() {
    const [
      totalProducts,
      totalSuppliers,
      totalMovements,
      lowStockProducts,
      totalStockValue,
      productsByCategory,
      movementsByType,
      recentMovements,
      topProducts,
      allProductsForValue,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.supplier.count({ where: { active: true } }),
      prisma.stockMovement.count(),
      prisma.product.count({
        where: { stock: { lte: prisma.product.fields.minStock } },
      }),
      prisma.product.aggregate({
        _sum: { stock: true },
      }),
      prisma.product.groupBy({
        by: ['category'],
        _count: { id: true },
        _sum: { stock: true },
      }),
      prisma.stockMovement.groupBy({
        by: ['type'],
        _sum: { quantity: true },
        _count: { id: true },
      }),
      prisma.stockMovement.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { id: true, name: true, category: true } } },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { stock: 'desc' },
        select: { id: true, name: true, stock: true, category: true, imageUrl: true },
      }),
      prisma.product.findMany({
        select: { price: true, stock: true },
      }),
    ]);

    const totalInventoryValue = allProductsForValue.reduce(
      (sum, p) => sum + Number(p.price) * p.stock,
      0
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const movementsLast7Days = await prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: { type: true, quantity: true, createdAt: true },
    });

    const dailyMovements: Record<string, { IN: number; OUT: number }> = {};
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const key = date.toISOString().split('T')[0];
      dailyMovements[key] = { IN: 0, OUT: 0 };
    }

    movementsLast7Days.forEach((m) => {
      const key = m.createdAt.toISOString().split('T')[0];
      if (dailyMovements[key]) {
        dailyMovements[key][m.type] += m.quantity;
      }
    });

    const movementsTrend = Object.entries(dailyMovements).map(([date, data]) => ({
      date,
      IN: data.IN,
      OUT: data.OUT,
    }));

    const categoryDistribution = productsByCategory.map((c) => ({
      category: c.category,
      count: c._count.id,
      stock: c._sum.stock || 0,
    }));

    const typeDistribution = movementsByType.map((m) => ({
      type: m.type,
      count: m._count.id,
      totalQuantity: m._sum.quantity || 0,
    }));

    return {
      totalProducts,
      totalSuppliers,
      totalMovements,
      lowStockCount: lowStockProducts,
      totalStockUnits: totalStockValue._sum.stock || 0,
      totalInventoryValue,
      categoryDistribution,
      typeDistribution,
      movementsTrend,
      topProducts,
      recentMovements: recentMovements.slice(0, 10).map((m) => ({
        id: m.id,
        type: m.type,
        quantity: m.quantity,
        reason: m.reason,
        productName: m.product.name,
        category: m.product.category,
        createdAt: m.createdAt,
      })),
    };
  }
}
