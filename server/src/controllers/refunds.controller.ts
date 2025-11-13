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
import { RefundsService } from '../application/refunds/refunds.service';

@Controller('refunds')
export class RefundsController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRefundDto: any) {
    return { message: 'Refund created', data: createRefundDto };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return { message: 'All refunds returned' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return { message: `Refund ${id} returned` };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateRefundDto: any) {
    return { message: `Refund ${id} updated`, data: updateRefundDto };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return { message: `Refund ${id} deleted` };
  }
}
