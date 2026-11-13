import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../services/auth.service';
export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message, fieldErrors: err.fieldErrors });
    return;
  }
  console.error('[Unhandled error]', err);
  res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
};
