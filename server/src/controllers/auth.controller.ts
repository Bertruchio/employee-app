import type { Request, Response, NextFunction } from 'express';
import type { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(201).json({ success: true, data: await this.authService.register(req.body as { email: string; password: string }) }); }
    catch (err) { next(err); }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { res.status(200).json({ success: true, data: await this.authService.login(req.body as { email: string; password: string }) }); }
    catch (err) { next(err); }
  };

  me     = (req: Request, res: Response): void => { res.json({ success: true, data: { id: req.userId, email: req.userEmail } }); };
  logout = (_req: Request, res: Response): void => { res.json({ success: true, data: null }); };
}
