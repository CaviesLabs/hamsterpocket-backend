import { Controller, Get } from '@nestjs/common';
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
}
