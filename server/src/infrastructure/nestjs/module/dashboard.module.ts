import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from '../../../entity/refund.entity';
import { DashboardService } from '../../../application/dashboard/dashboard.service';
import { DashboardController } from '../../../controllers/dashboard.controller';

@Module({
  // imports: [TypeOrmModule.forFeature([RefundEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
