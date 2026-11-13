import type { Request, Response, NextFunction } from 'express';
import type { ValidationResult } from '@shared/types/api.types';
type Validator = (input: unknown) => ValidationResult<unknown>;
export const validateBody = (validator: Validator) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = validator(req.body);
    if (!result.isValid) {
      res.status(400).json({ success: false, message: 'Ошибка валидации', fieldErrors: result.errors });
      return;
    }
    next();
  };
