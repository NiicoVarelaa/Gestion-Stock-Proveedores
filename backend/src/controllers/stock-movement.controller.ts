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
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const productId = req.query.productId as string | undefined;
      const type = req.query.type as 'IN' | 'OUT' | undefined;
      const from = req.query.from as string | undefined;
      const to = req.query.to as string | undefined;
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
