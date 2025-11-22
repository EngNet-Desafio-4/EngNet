import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '../application/dashboard/dashboard.service';
import { JwtAuthGuard } from '../application/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('engnet_auth')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  async getOverview() {
    return await this.dashboardService.getOverviewStats();
  }

  @Get('refunds')
  async getRefundsStats() {
    return await this.dashboardService.getPendingRefunds();
  }

  @Get('members')
  async getActiveMembers() {
    return await this.dashboardService.getActiveMembers();
  }

  @Get('contracts')
  async getContractsStats() {
    return await this.dashboardService.getClosedContracts();
  }
}
