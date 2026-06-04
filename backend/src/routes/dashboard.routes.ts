import { Router, Request, Response, NextFunction } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router: Router = Router();
const controller = new DashboardController();

router.get('/metrics', controller.getMetrics);

export default router;
