import { Module } from '@nestjs/common';

import { OrmModule } from '../orm/orm.module';
import { CoinGeckoClient } from '../providers/coin-gecko.client';
import { NetworkProvider } from '../providers/network.provider';
import { WhitelistController } from './controllers/whitelist.controller';
import { SyncPriceService } from './services/sync-price.service';
import { WhitelistService } from './services/whitelist.service';

@Module({
  imports: [OrmModule],
  providers: [
    /** Providers */
    NetworkProvider,
    CoinGeckoClient,
    /** Services */
    WhitelistService,
    SyncPriceService,
  ],
  controllers: [WhitelistController],
})
export class WhitelistModule {}
