import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportsService } from '../application/reports/reports.service';

@Controller('reports')
export class ReportsController {
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return { message: 'All reports returned' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return { message: `Report ${id} returned` };
  }
}
