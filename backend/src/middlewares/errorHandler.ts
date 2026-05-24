import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.id || 'unknown';

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      requestId,
    });
  }

  console.error(`[Request ${requestId}] Unhandled error:`, err);

  return res.status(500).json({
    success: false,
    message: env.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message,
    requestId,
  });
};
