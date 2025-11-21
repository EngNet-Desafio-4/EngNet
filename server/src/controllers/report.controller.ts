import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from '../application/report/report.service';
import { JwtAuthGuard } from '../application/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('engnet_auth')
@Controller('report')
export class ReportController {
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return { message: 'All report returned' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return { message: `Report ${id} returned` };
  }
}
