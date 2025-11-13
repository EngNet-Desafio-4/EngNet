import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ReportService } from '../application/report/report.service';

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
