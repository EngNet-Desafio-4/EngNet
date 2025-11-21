import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundEntity } from '../../entity/refund.entity';
import { RefundDto } from './dto/RefundDto';

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(RefundEntity)
    private refundRepository: Repository<RefundEntity>,
  ) {}

  async getByID(id: number): Promise<RefundEntity | null> {
    return await this.refundRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<RefundEntity[]> {
    return await this.refundRepository.find();
  }

  async create(dto: RefundDto): Promise<RefundEntity> {
    const newRefund = this.refundRepository.create(dto);
    return await this.refundRepository.save(newRefund);
  }

  async update(id: number, dto: RefundDto): Promise<RefundEntity | null> {
    await this.refundRepository.update(id, dto);
    return this.getByID(id);
  }

  async deleteById(id: number): Promise<void> {
    await this.refundRepository.delete(id);
  }
}
