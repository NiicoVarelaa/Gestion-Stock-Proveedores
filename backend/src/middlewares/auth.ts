import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token || req.headers.cookie?.match(/auth_token=([^;]+)/)?.[1];

  if (!token) {
    throw new AppError('Token no proporcionado', 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Token inválido o expirado', 401);
  }
};
