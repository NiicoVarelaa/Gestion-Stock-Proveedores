import { Request, Response, NextFunction } from 'express';
import { StockMovementService } from '../services/stock-movement.service';

const movementService = new StockMovementService();

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
      const { page, limit, productId, type, from, to } = req.query as unknown as {
        page: number;
        limit: number;
        productId?: string;
        type?: 'IN' | 'OUT';
        from?: string;
        to?: string;
      };
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
