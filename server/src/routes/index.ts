import { Router }             from 'express';
import type Database          from 'better-sqlite3';
import { UserRepository }     from '../repositories/user.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { AuthService }        from '../services/auth.service';
import { EmployeeService }    from '../services/employee.service';
import { AuthController }     from '../controllers/auth.controller';
import { EmployeeController } from '../controllers/employee.controller';
import { createAuthMiddleware }                        from '../middleware/auth.middleware';
import { validateBody }                                from '../middleware/validate.middleware';
import { validateAuthCredentials, validateCreateEmployee } from '@shared/validators';

export const createRouter = (db: Database.Database): Router => {
  const router    = Router();
  const authSvc   = new AuthService(new UserRepository(db));
  const empSvc    = new EmployeeService(new EmployeeRepository(db));
  const authCtrl  = new AuthController(authSvc);
  const empCtrl   = new EmployeeController(empSvc);
  const requireAuth = createAuthMiddleware(authSvc);

  router.post('/auth/register', validateBody(validateAuthCredentials), authCtrl.register);
  router.post('/auth/login',    validateBody(validateAuthCredentials), authCtrl.login);
  router.get('/auth/me',        requireAuth, authCtrl.me);
  router.post('/auth/logout',   requireAuth, authCtrl.logout);
  router.get('/employees',      requireAuth, empCtrl.getAll);
  router.post('/employees',     requireAuth, validateBody(validateCreateEmployee), empCtrl.create);

  return router;
};
