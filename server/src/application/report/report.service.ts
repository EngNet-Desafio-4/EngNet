import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from '../../entity/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  async getByID(id: number): Promise<ReportEntity | null> {
    return await this.reportRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<ReportEntity[]> {
    return await this.reportRepository.find();
  }
}
