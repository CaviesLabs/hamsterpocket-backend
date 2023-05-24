import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatisticsService } from '../services/statistics.service';

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}
  @Get('/latest')
  getLatest() {
    return this.statisticsService.getLatest();
  }

  @Post('/calculate-volume')
  snapShotPNL() {
    return this.statisticsService.calculateNewStatistics();
  }
}
