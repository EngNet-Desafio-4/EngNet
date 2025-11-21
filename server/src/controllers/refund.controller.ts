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
import { RefundService } from '../application/refund/refund.service';
import { RefundDto } from '../application/refund/dto/RefundDto';
import { JwtAuthGuard } from '../application/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('engnet_auth')
@Controller('refund')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: RefundDto) {
    return this.refundService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.refundService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.refundService.getByID(Number(id));
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() dto: RefundDto) {
    return this.refundService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.refundService.deleteById(Number(id));
  }
}