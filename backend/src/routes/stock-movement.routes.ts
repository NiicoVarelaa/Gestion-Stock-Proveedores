import { Router } from 'express';
import { StockMovementController } from '../controllers/stock-movement.controller';
import { validate } from '../middlewares/validate';
import {
  createMovementSchema,
  getMovementSchema,
  listMovementsSchema,
} from '../routes/stock-movement.schema';

const router = Router();
const controller = new StockMovementController();

router.post('/', validate(createMovementSchema), controller.create.bind(controller));
router.get('/', validate(listMovementsSchema), controller.findAll.bind(controller));
router.get('/:id', validate(getMovementSchema), controller.findById.bind(controller));

export default router;
