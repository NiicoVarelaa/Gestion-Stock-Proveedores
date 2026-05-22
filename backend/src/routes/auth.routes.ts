import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../routes/auth.schema';

const router: express.Router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), controller.register.bind(controller));
router.post('/login', validate(loginSchema), controller.login.bind(controller));
router.post('/logout', controller.logout.bind(controller));

export default router;
