import { Module } from '@nestjs/common';
import { OrmModule } from '@/orm/orm.module';
import { RegistryProvider } from '@/providers/registry.provider';
import { PoolController } from './controllers/pool.controller';
import { SolanaPoolProvider } from '@/providers/solana-pocket-program/solana-pool.provider';
import { PoolMockService } from './services/pool-mock.service';
import { PoolService } from './services/pool.service';
import { SyncPoolService } from './services/sync-pool.service';
import { PortfolioService } from '@/portfolio/services/portfolio.service';
import { SyncPoolActivityService } from './services/sync-pool-activity.service';
import { PoolActivityService } from './services/pool-activity.service';
import { MigrateChainIdCommand } from './commands/migrate-chain-id';
import { SyncEvmPoolActivityService } from './services/sync-evm-pool-activity.service';
import { SyncEvmPoolService } from './services/sync-evm-pool.service';
import { EVMPoolController } from './controllers/evm-pool.controller';
import { FixDecimalsEventData } from './commands/fix-decimals-event-data';
import { SyncAptosActivityService } from '@/pool/services/sync-aptos-activity.service';
import { SyncAptosPoolService } from '@/pool/services/sync-aptos-pool.service';
import { AptosPoolController } from '@/pool/controllers/aptos-pool.controller';

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
    PoolActivityService,
    PortfolioService,
    SyncEvmPoolActivityService,
    SyncEvmPoolService,
    SyncAptosActivityService,
    SyncAptosPoolService,
    /**
     * @dev Commands
     */
    MigrateChainIdCommand,
    FixDecimalsEventData,
  ],
  controllers: [PoolController, AptosPoolController, EVMPoolController],
})
export class PoolModule {}
