import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    throw new AppError('Token no proporcionado', 401);
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Token invÃ¡lido o expirado', 401);
  }
};
