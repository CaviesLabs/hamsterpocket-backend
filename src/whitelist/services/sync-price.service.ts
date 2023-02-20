import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Model } from 'mongoose';
import { WhitelistModel } from '../../orm/model/whitelist.model';
import { CoinGeckoClient } from '../../providers/coin-gecko.client';

@Injectable()
export class SyncPriceService {
  constructor(
    private readonly coinGeckoClient: CoinGeckoClient,
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistModel>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncAllWhitelistCurrencyPrice() {
    const whitelists = await this.whiteListRepo.find({});
    if (whitelists.length == 0) return;
    /** Fetch prices */
    const pricing = await this.coinGeckoClient.getPriceInCurrencies(
      whitelists.map(({ coinGeckoId }) => coinGeckoId),
      ['usd'],
    );
    /** Map prices */
    for (const whitelist of whitelists) {
      whitelist.estimatedValue = pricing[whitelist.coinGeckoId].usd;
    }
    /** Update DB */
    await this.whiteListRepo.bulkSave(whitelists);
  }
}
