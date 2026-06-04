import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const category = req.query.category as string | undefined;
      const supplierId = req.query.supplierId as string | undefined;
      const search = req.query.search as string | undefined;
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
      const product = await productService.update(req.params.id as string, req.body);
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

  async getLowStock(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getLowStock();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }
}
