import express, { Router } from 'express';
import { PasswordResetController } from '../controllers/password-reset.controller';
import { validate } from '../middlewares/validate';
import {
  forgotPasswordSchema,
  verifyCodeSchema,
  resetPasswordSchema,
} from '../routes/password-reset.schema';

const router: express.Router = Router();
const controller = new PasswordResetController();

router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword.bind(controller));
router.post('/verify-code', validate(verifyCodeSchema), controller.verifyCode.bind(controller));
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword.bind(controller));

export default router;
