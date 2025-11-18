import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../../entity/employee.entity';
import { EmployeeDto } from './dto/EmployeeDto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async getByID(id: number): Promise<EmployeeEntity | null> {
    return await this.employeeRepository.findOneBy({ id });
  }

  async getAll(): Promise<EmployeeEntity[]> {
    return await this.employeeRepository.find();
  }

  async create(employee: EmployeeDto): Promise<EmployeeEntity> {
    const partial: Partial<EmployeeEntity> = {
      ...employee,
      photo: employee.photo ? Buffer.from(employee.photo, 'base64') : undefined,
    };
    const newEmployee = this.employeeRepository.create(partial);
    return await this.employeeRepository.save(newEmployee);
  }

  async update(id: number, dto: EmployeeDto): Promise<EmployeeEntity | null> {
    const partial: Partial<EmployeeEntity> = {
      ...dto,
      photo: dto.photo ? Buffer.from(dto.photo, 'base64') : undefined,
    };
    await this.employeeRepository.update(id, partial);
    return this.getByID(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
