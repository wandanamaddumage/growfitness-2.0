import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@grow-fitness/shared-types';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('weekly-sessions')
  getWeeklySessions() {
    return this.dashboardService.getWeeklySessions();
  }

  @Get('finance')
  getFinanceSummary() {
    return this.dashboardService.getFinanceSummary();
  }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get recent activity logs' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
  })
  @ApiResponse({ status: 200, description: 'List of recent activity logs' })
  getActivityLogs(@Query() pagination: PaginationDto) {
    return this.dashboardService.getActivityLogs(pagination);
  }
}
