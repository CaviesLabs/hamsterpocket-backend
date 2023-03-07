import { Module } from '@nestjs/common';

import { OrmModule } from '../orm/orm.module';
import { PortfolioController } from './controllers/portfolio.controller';
import { PortfolioService } from './services/portfolio.service';

@Module({
  imports: [OrmModule],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
