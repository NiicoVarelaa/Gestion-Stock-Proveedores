import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await dashboardService.getMetrics();
      res.json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }
}
