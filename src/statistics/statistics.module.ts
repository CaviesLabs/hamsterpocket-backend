import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsService } from './services/statistics.service';

@Module({
  imports: [OrmModule],
  providers: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
