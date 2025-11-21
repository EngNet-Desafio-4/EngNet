import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundEntity } from '../../../entity/refund.entity';
import { RefundService } from '../../../application/refund/refund.service';
import { RefundController } from '../../../controllers/refund.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RefundEntity])],
  controllers: [RefundController],
  providers: [RefundService],
  exports: [RefundService],
})
export class RefundModule {}
