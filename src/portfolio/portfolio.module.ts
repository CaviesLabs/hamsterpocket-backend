import { Module } from '@nestjs/common';

import { MqModule } from '../mq/mq.module';
import { OrmModule } from '../orm/orm.module';
import { TokenMetadataModule } from '../token-metadata/token-metadata.module';
import { PortfolioController } from './controllers/portfolio.controller';
import { PortfolioProcessor } from './queues/portfolio.processor';
import { PortfolioService } from './services/portfolio.service';

@Module({
  imports: [OrmModule, MqModule, TokenMetadataModule],
  providers: [PortfolioService, PortfolioProcessor],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
