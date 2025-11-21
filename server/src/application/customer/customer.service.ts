import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../entity/customer.entity';
import { CustomerDto } from './dto/CustomerDto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  async getByID(id: number): Promise<CustomerEntity | null> {
    return this.customerRepository.findOneBy({ id });
  }

  async getAll(): Promise<CustomerEntity[]> {
    return this.customerRepository.find();
  }

  async create(dto: CustomerDto): Promise<CustomerEntity> {
    const newCustomer = this.customerRepository.create(dto);
    return this.customerRepository.save(newCustomer);
  }

  async update(id: number, dto: CustomerDto): Promise<CustomerEntity | null> {
    await this.customerRepository.update(id, dto);
    return this.getByID(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
