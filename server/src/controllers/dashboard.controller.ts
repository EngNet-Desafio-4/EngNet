import { Controller, Get } from '@nestjs/common';
import { DashboardService } from '../application/dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  @Get('overview')
  getOverview() {
    return { totola: 10000 };
  }

  @Get('refunds')
  getRefundsStats() {
    return { totola: 10000 };
  }

  @Get('contracts')
  getContractsStats() {
    return { totola: 10000 };
  }
}
