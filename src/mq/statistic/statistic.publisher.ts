import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StatisticsService } from '../../statistics/services/statistics.service';

@Injectable()
export class StatisticPublisher implements OnApplicationBootstrap {
  constructor(private readonly statsService: StatisticsService) {}

  async onApplicationBootstrap() {
    await this.calculateNewStatistics();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async calculateNewStatistics() {
    await this.statsService.calculateNewStatistics();
  }
}
