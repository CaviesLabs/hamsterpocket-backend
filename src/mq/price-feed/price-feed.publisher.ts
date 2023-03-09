import { Injectable } from '@nestjs/common';

import { SyncPriceService } from '../../whitelist/services/sync-price.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Timer } from '../../providers/utils.provider';

@Injectable()
export class PriceFeedPublisher {
  constructor(private readonly syncPriceService: SyncPriceService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncPrice() {
    const timer = new Timer('SYNC_WHITELISTED_CURRENCY');
    timer.start();
    await this.syncPriceService.syncAllWhitelistCurrencyPrice();
    timer.stop();
  }
}
