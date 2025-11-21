import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../../../entity/customer.entity';
import { CustomerController } from '../../../controllers/customer.controller';
import { CustomerService } from '../../../application/customer/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
