import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../../entity/customer.entity';
import { RefundEntity } from '../../entity/refund.entity';
import { EmployeeEntity } from '../../entity/employee.entity';
import { RefundStatus } from '../../entity/enums.enum';
import {
  OverviewStats,
  PendingRefunds,
  ContractClosed,
} from './dto/DashboardDto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,

    @InjectRepository(RefundEntity)
    private refundRepository: Repository<RefundEntity>,

    @InjectRepository(EmployeeEntity)
    private employeeRepository: Repository<EmployeeEntity>,
  ) {}

  async getOverviewStats(): Promise<OverviewStats> {
    const totalPurchases = await this.customerRepository
      .createQueryBuilder('c')
      .select('SUM(c.totalPurchases)', 'sum')
      .getRawOne<{ sum: string | null }>();
    const totalRefunds = await this.refundRepository
      .createQueryBuilder('r')
      .select('SUM(r.amount)', 'sum')
      .where('r.status = :status', { status: RefundStatus.APROVADO })
      .getRawOne<{ sum: string | null }>();
    const purchases = Number(totalPurchases?.sum ?? 0);
    const refunds = Number(totalRefunds?.sum ?? 0);
    return {
      totalPurchases: purchases,
      totalRefundsApproved: refunds,
      netTotal: purchases - refunds,
    };
  }

  async getPendingRefunds(): Promise<PendingRefunds> {
    const count = await this.refundRepository.count({
      where: { status: RefundStatus.PENDENTE },
    });
    return { pendingRefunds: count };
  }

  async getActiveMembers(): Promise<EmployeeEntity[]> {
    // const employees = await this.employeeRepository.find({
    //   where: { active: 'ATIVO' },
    //   relations: ['refunds'],
    // });

    return await this.employeeRepository.find();
  }

  async getClosedContracts(): Promise<ContractClosed[]> {
    const result = await this.customerRepository
      .createQueryBuilder('c')
      .select(['c.name AS name', 'c.totalPurchases AS totalPurchases'])
      .where('c.totalPurchases > 0')
      .orderBy('c.totalPurchases', 'DESC')
      .getRawMany<ContractClosed>();
    return result;
  }
}
