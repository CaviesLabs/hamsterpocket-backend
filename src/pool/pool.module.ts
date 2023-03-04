import { Module } from '@nestjs/common';
import { MqModule } from '../mq/mq.module';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { PoolController } from './controllers/pool.controller';
import { SolanaPoolProvider } from '../providers/pool-program/solana-pool.provider';
import { PoolProcessor } from './queues/pool.processor';
import { PoolMockService } from './services/pool-mock.service';
import { PoolService } from './services/pool.service';
import { SyncPoolService } from './services/sync-pool.service';
import { PortfolioService } from "../portfolio/services/portfolio.service";

@Module({
  imports: [OrmModule, MqModule],
  providers: [
    /** Providers */
    SolanaPoolProvider,
    /** Services */
    RegistryProvider,
    PoolService,
    SyncPoolService,
    PoolMockService,
    PortfolioService,
    /** Consumer */
    PoolProcessor,
  ],
  controllers: [PoolController],
})
export class PoolModule {}
