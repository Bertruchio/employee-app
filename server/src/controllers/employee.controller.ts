import type { Request, Response, NextFunction } from 'express';
import type { EmployeeService } from '../services/employee.service';
import type { EmployeeFilterParams } from '@shared/types/employee.types';
import { isDepartment } from '@shared/validators';
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  getAll = (req: Request, res: Response): void => {
    const search     = typeof req.query['search']     === 'string' ? req.query['search']     : '';
    const department = typeof req.query['department'] === 'string' ? req.query['department'] : '';
    const filter: EmployeeFilterParams = { search, department: isDepartment(department) ? department : '' };
    res.json({ success: true, data: this.employeeService.getAll(filter) });
  };
  create = (req: Request, res: Response, next: NextFunction): void => {
    try { res.status(201).json({ success: true, data: this.employeeService.create(req.body as any) }); }
    catch (err) { next(err); }
  };
}
