import { Injectable } from '@nestjs/common';

import { SyncPriceService } from '../../whitelist/services/sync-price.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PriceFeedPublisher {
  constructor(private readonly syncPriceService: SyncPriceService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncPrice() {
    await this.syncPriceService.syncAllWhitelistCurrencyPrice();
  }
}
