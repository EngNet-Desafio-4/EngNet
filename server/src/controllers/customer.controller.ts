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
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../application/customer/customer.service';
import { CustomerDto } from '../application/customer/dto/CustomerDto';
import { JwtAuthGuard } from '../application/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('engnet_auth')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CustomerDto) {
    return this.customerService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.customerService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.customerService.getByID(Number(id));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: CustomerDto) {
    return this.customerService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.customerService.deleteById(Number(id));
  }
}
