import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '../application/dashboard/dashboard.service';
import { JwtAuthGuard } from '../application/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('engnet_auth')
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
