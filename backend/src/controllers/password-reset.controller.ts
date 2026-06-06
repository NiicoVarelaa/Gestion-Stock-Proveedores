import { Request, Response, NextFunction } from 'express';
import { PasswordResetService } from '../services/password-reset.service';

const passwordResetService = new PasswordResetService();

export class PasswordResetController {
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await passwordResetService.requestReset(email);
      res.json({ success: true, message: 'Si el email existe, recibirás un código de verificación' });
    } catch (error) {
      next(error);
    }
  }

  async verifyCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;
      const result = await passwordResetService.verifyCode(email, code);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code, password } = req.body;
      await passwordResetService.resetPassword(email, code, password);
      res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}
