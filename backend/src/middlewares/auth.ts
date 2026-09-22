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

interface RoleOptions {
  required?: string | string[];
  allowed?: string | string[];
}

/**
 * Middleware de autenticación opcional con verificación de roles.
 * 
 * Uso sencillo (solo valida token, cualquier role):
 *   authMiddleware()
 * 
 * Con requisito de role específico:
 *   authMiddleware({ required: 'admin' })
 * 
 * Con roles permitidos:
 *   authMiddleware({ allowed: ['admin', 'user'] })
 */
export const authMiddleware = (
  roleOptions?: RoleOptions
): ((req: AuthRequest, res: Response, next: NextFunction) => void) => {
  const options = roleOptions || {};

  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.auth_token;

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return next(new AppError('Token no proporcionado', 401));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret!) as {
        id: string;
        email: string;
        role: string;
      };
      req.user = decoded;

      // Verificación de roles si se especificaron opciones
      if (options.required && req.user.role !== options.required) {
        return next(new AppError('No tienes permiso para acceder a este recurso', 403));
      }

      if (options.allowed) {
        const allowedRoles = Array.isArray(options.allowed) ? options.allowed : [options.allowed];
        if (!allowedRoles.includes(req.user.role)) {
          return next(new AppError('No tienes permiso para acceder a este recurso', 403));
        }
      }

      next();
    } catch {
      return next(new AppError('Token inválido o expirado', 401));
    }
  };
};