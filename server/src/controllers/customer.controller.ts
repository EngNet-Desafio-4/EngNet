import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from '../application/customer/customer.service';

@Controller('customer')
export class CustomerController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCustomerDto: any) {
    return { message: 'Customer created', data: createCustomerDto };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return { message: 'All customer returned' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return { message: `Customer ${id} returned` };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateCustomerDto: any) {
    return { message: `Customer ${id} updated`, data: updateCustomerDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return { message: `Customer ${id} deleted` };
  }
}
