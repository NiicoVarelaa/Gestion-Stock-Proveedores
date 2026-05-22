import { Request, Response, NextFunction } from 'express';
import { AuthService, setAuthCookie, clearAuthCookie } from '../services/auth.service';

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
}
