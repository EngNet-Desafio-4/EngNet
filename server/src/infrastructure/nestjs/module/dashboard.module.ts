import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from '../../../entity/refund.entity';
import { EmployeeEntity } from '../../../entity/employee.entity';
import { CustomerEntity } from '../../../entity/customer.entity';
import { DashboardService } from '../../../application/dashboard/dashboard.service';
import { DashboardController } from '../../../controllers/dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, RefundEntity, EmployeeEntity]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
