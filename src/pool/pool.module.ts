import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { PoolController } from './controllers/pool.controller';
import { SolanaPoolProvider } from '../providers/pool-program/solana-pool.provider';
import { PoolMockService } from './services/pool-mock.service';
import { PoolService } from './services/pool.service';
import { SyncPoolService } from './services/sync-pool.service';
import { PortfolioService } from '../portfolio/services/portfolio.service';
import { SyncPoolActivityService } from './services/sync-pool-activity.service';

@Module({
  imports: [OrmModule],
  providers: [
    /** Providers */
    SolanaPoolProvider,
    /** Services */
    RegistryProvider,
    PoolService,
    SyncPoolService,
    SyncPoolActivityService,
    PoolMockService,
    PortfolioService,
  ],
  controllers: [PoolController],
})
export class PoolModule {}
