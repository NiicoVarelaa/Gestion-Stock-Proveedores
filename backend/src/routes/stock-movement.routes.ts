import express, { Router } from 'express';
import { StockMovementController } from '../controllers/stock-movement.controller';
import { validate } from '../middlewares/validate';
import { authMiddleware } from '../middlewares/auth';
import {
  createMovementSchema,
  getMovementSchema,
  listMovementsSchema,
} from '../routes/stock-movement.schema';

const router: express.Router = Router();
const controller = new StockMovementController();

router.post('/', authMiddleware({ required: 'admin' }), validate(createMovementSchema), controller.create.bind(controller));
router.get('/', validate(listMovementsSchema), controller.findAll.bind(controller));
router.get('/csv', authMiddleware({ required: 'admin' }), controller.exportCsv.bind(controller));
router.get('/:id', validate(getMovementSchema), controller.findById.bind(controller));

export default router;
