import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { toCsv } from '../utils/csv';

const productService = new ProductService();

const getQueryParam = (query: Request['query'], key: string): string | undefined => {
  const val = query[key];
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : undefined;
  if (typeof val === 'string') return val;
  return undefined;
};

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body, req.file);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const category = getQueryParam(req.query, 'category');
      const supplierId = getQueryParam(req.query, 'supplierId');
      const search = getQueryParam(req.query, 'search');
      const result = await productService.findAll(page, limit, { category, supplierId, search });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.findById(req.params.id as string);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(req.params.id as string, req.body, req.file);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.remove(req.params.id as string);
      res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
      next(error);
    }
  }

  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No se proporcionó una imagen' });
      }
      const product = await productService.updateImage(req.params.id as string, req.file);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getLowStock();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const category = getQueryParam(req.query, 'category');
      const supplierId = getQueryParam(req.query, 'supplierId');
      const search = getQueryParam(req.query, 'search');
      const products = await productService.findAllForExport({ category, supplierId, search });

      const csv = toCsv(
        [
          { header: 'id', value: (r) => r.id },
          { header: 'name', value: (r) => r.name },
          { header: 'category', value: (r) => r.category },
          { header: 'price', value: (r) => (r as Record<string, unknown>).price },
          { header: 'stock', value: (r) => r.stock },
          { header: 'minStock', value: (r) => r.minStock },
          { header: 'supplierId', value: (r) => r.supplierId },
          { header: 'supplierName', value: (r) => (r as { supplier: { name: string } }).supplier?.name ?? '' },
          { header: 'imageUrl', value: (r) => r.imageUrl },
          { header: 'createdAt', value: (r) => `${(r as { createdAt: Date }).createdAt.toISOString()}` },
        ],
        products as unknown as Record<string, unknown>[]
      );

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="products-${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}
