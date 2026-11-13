import type { Employee, CreateEmployeeDto, EmployeeFilterParams } from '@shared/types/employee.types';
import { EmployeeRepository } from '../repositories/employee.repository';
export class EmployeeService {
  constructor(private readonly employeeRepo: EmployeeRepository) {}
  getAll(filter: EmployeeFilterParams = {}): Employee[] { return this.employeeRepo.findAll(filter); }
  create(dto: CreateEmployeeDto): Employee { return this.employeeRepo.create(dto); }
}
