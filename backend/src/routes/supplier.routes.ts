import express, { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth';
import {
  createSupplierSchema,
  updateSupplierSchema,
  getSupplierSchema,
  listSuppliersSchema,
} from '../routes/supplier.schema';

const router: express.Router = Router();
const controller = new SupplierController();

// Rutas públicas: listar y ver un proveedor
router.get('/', validate(listSuppliersSchema), controller.findAll.bind(controller));
router.get('/csv', authMiddleware({ required: 'admin' }), controller.exportCsv.bind(controller));
router.get('/:id', validate(getSupplierSchema), controller.findById.bind(controller));

// Rutas de solo admin: crear, editar, desactivar
router.post('/', authMiddleware({ required: 'admin' }), validate(createSupplierSchema), controller.create.bind(controller));
router.put('/:id', authMiddleware({ required: 'admin' }), validate(updateSupplierSchema), controller.update.bind(controller));
router.patch('/:id/deactivate', authMiddleware({ required: 'admin' }), validate(getSupplierSchema), controller.deactivate.bind(controller));

export default router;