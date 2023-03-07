import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { POOL_ACTIVITY_QUEUE } from './dto/pool-activity.queue';
import { POOL_QUEUE } from './dto/pool.queue';
import { PORTFOLIO_QUEUE } from './dto/portfolio.queue';
import { PortfolioPublisher } from './portfolio/portfolio.publisher';
import { PortfolioProcessor } from './portfolio/portfolio.processor';
import { OrmModule } from '../orm/orm.module';
import { PortfolioService } from '../portfolio/services/portfolio.service';
import { PoolService } from '../pool/services/pool.service';
import { SolanaPoolProvider } from '../providers/pool-program/solana-pool.provider';
import { RegistryProvider } from '../providers/registry.provider';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: POOL_ACTIVITY_QUEUE },
      { name: POOL_QUEUE },
      { name: PORTFOLIO_QUEUE },
    ),

    OrmModule,
  ],
  exports: [BullModule],
  providers: [
    /**
     * @dev Import services and providers
     */
    PortfolioService,
    PoolService,
    RegistryProvider,
    SolanaPoolProvider,

    /**
     * @dev
     */
    PortfolioProcessor,
    PortfolioPublisher,
  ],
})
export class MqModule {}
