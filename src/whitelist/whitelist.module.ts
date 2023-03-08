import { Module } from '@nestjs/common';

import { OrmModule } from '../orm/orm.module';
import { CoinGeckoClient } from '../providers/coin-gecko.client';
import { NetworkProvider } from '../providers/network.provider';
import { WhitelistController } from './controllers/whitelist.controller';
import { SyncPriceService } from './services/sync-price.service';
import { WhitelistService } from './services/whitelist.service';
import { MarketSeedingCommand } from './commands/market-seeding.command';
import { PriceFeedSyncCommand } from './commands/price-feed.command';

@Module({
  imports: [OrmModule],
  providers: [
    /** Providers */
    NetworkProvider,
    CoinGeckoClient,

    /** Services */
    WhitelistService,
    SyncPriceService,

    /**
     * @dev Commands
     */
    MarketSeedingCommand,
    PriceFeedSyncCommand,
  ],
  controllers: [WhitelistController],
  exports: [SyncPriceService],
})
export class WhitelistModule {}
