import { Request, Response, NextFunction } from 'express';
import { StockMovementService } from '../services/stock-movement.service';

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
      const result = await movementService.findAll(page, limit, { productId, type, from, to });
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
}
