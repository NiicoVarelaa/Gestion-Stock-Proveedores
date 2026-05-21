import express, { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  listProductsSchema,
} from '../routes/product.schema';

const router: express.Router = Router();
const controller = new ProductController();

router.post('/', validate(createProductSchema), controller.create.bind(controller));
router.get('/low-stock', controller.getLowStock.bind(controller));
router.get('/', validate(listProductsSchema), controller.findAll.bind(controller));
router.get('/:id', validate(getProductSchema), controller.findById.bind(controller));
router.put('/:id', validate(updateProductSchema), controller.update.bind(controller));
router.delete('/:id', validate(getProductSchema), controller.remove.bind(controller));

export default router;
