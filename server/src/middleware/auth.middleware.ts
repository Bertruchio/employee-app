import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
declare global {
  namespace Express {
    interface Request { userId?: number; userEmail?: string; }
  }
}
export const createAuthMiddleware = (authService: AuthService) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const header = req.headers['authorization'];
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Требуется авторизация' });
      return;
    }
    try {
      const user    = authService.verifyToken(header.slice(7));
      req.userId    = user.id;
      req.userEmail = user.email;
      next();
    } catch {
      res.status(401).json({ success: false, message: 'Недействительный токен' });
    }
  };
