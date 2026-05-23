import { Request, Response, NextFunction } from 'express';
import { AuthService, setAuthCookie, clearAuthCookie } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);
      setAuthCookie(res, result.token);
      res.status(201).json({ success: true, data: { user: result.user } });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      setAuthCookie(res, result.token);
      res.json({ success: true, data: { user: result.user } });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response) {
    clearAuthCookie(res);
    res.json({ success: true, message: 'Sesión cerrada' });
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new NotFoundError('Usuario no encontrado');
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true },
      });
      if (!user) throw new NotFoundError('Usuario no encontrado');
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }
}
