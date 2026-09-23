import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';
import { toCsv } from '../utils/csv';

const supplierService = new SupplierService();

const getQueryParam = (query: Request['query'], key: string): string | undefined => {
  const val = query[key];
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : undefined;
  if (typeof val === 'string') return val;
  return undefined;
};

export class SupplierController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await supplierService.create(req.body);
      res.status(201).json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = getQueryParam(req.query, 'search');
      const result = await supplierService.findAll(page, limit, search);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await supplierService.findById(req.params.id as string);
      res.json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await supplierService.update(req.params.id as string, req.body);
      res.json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await supplierService.deactivate(req.params.id as string);
      res.json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const search = getQueryParam(req.query, 'search');
      const suppliers = await supplierService.findAllForExport(search);

      const csv = toCsv(
        [
          { header: 'id', value: (r) => r.id },
          { header: 'name', value: (r) => r.name },
          { header: 'email', value: (r) => r.email },
          { header: 'phone', value: (r) => r.phone },
          { header: 'address', value: (r) => r.address },
          { header: 'active', value: (r) => r.active },
          { header: 'productCount', value: (r) => (r as { _count: { products: number } })._count?.products ?? 0 },
          { header: 'createdAt', value: (r) => `${(r as { createdAt: Date }).createdAt.toISOString()}` },
        ],
        suppliers as unknown as Record<string, unknown>[]
      );

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="suppliers-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}
