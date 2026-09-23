import { Request, Response, NextFunction } from 'express';
import { StockMovementService } from '../services/stock-movement.service';
import { toCsv } from '../utils/csv';

const movementService = new StockMovementService();

const getQueryParam = (query: Request['query'], key: string): string | undefined => {
  const val = query[key];
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : undefined;
  if (typeof val === 'string') return val;
  return undefined;
};

export class StockMovementController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await movementService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const productId = getQueryParam(req.query, 'productId');
      const type = getQueryParam(req.query, 'type') as 'IN' | 'OUT' | undefined;
      const from = getQueryParam(req.query, 'from');
      const to = getQueryParam(req.query, 'to');
      const supplierId = getQueryParam(req.query, 'supplierId');
      const category = getQueryParam(req.query, 'category');
      const result = await movementService.findAll(page, limit, { productId, type, from, to, supplierId, category });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const movement = await movementService.findById(req.params.id as string);
      res.json({ success: true, data: movement });
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = getQueryParam(req.query, 'productId');
      const type = getQueryParam(req.query, 'type') as 'IN' | 'OUT' | undefined;
      const from = getQueryParam(req.query, 'from');
      const to = getQueryParam(req.query, 'to');
      const supplierId = getQueryParam(req.query, 'supplierId');
      const category = getQueryParam(req.query, 'category');
      const movements = await movementService.findAllForExport({ productId, type, from, to, supplierId, category });

      const csv = toCsv(
        [
          { header: 'id', value: (r) => r.id },
          { header: 'type', value: (r) => r.type },
          { header: 'quantity', value: (r) => r.quantity },
          { header: 'reason', value: (r) => r.reason },
          { header: 'productId', value: (r) => r.productId },
          { header: 'productName', value: (r) => (r as { product: { name: string } }).product?.name ?? '' },
          { header: 'productCategory', value: (r) => (r as { product: { category: string } }).product?.category ?? '' },
          { header: 'createdAt', value: (r) => `${(r as { createdAt: Date }).createdAt.toISOString()}` },
        ],
        movements as unknown as Record<string, unknown>[]
      );

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="movements-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}
