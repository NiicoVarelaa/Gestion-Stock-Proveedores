import express, { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { validate } from '../middlewares/validate';
import {
  createSupplierSchema,
  updateSupplierSchema,
  getSupplierSchema,
  listSuppliersSchema,
} from '../routes/supplier.schema';

const router: express.Router = Router();
const controller = new SupplierController();

router.post('/', validate(createSupplierSchema), controller.create.bind(controller));
router.get('/', validate(listSuppliersSchema), controller.findAll.bind(controller));
router.get('/:id', validate(getSupplierSchema), controller.findById.bind(controller));
router.put('/:id', validate(updateSupplierSchema), controller.update.bind(controller));
router.patch('/:id/deactivate', validate(getSupplierSchema), controller.deactivate.bind(controller));

export default router;
