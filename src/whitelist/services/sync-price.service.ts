import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WhitelistModel } from '../../orm/model/whitelist.model';
import { CoinGeckoClient } from '../../providers/coin-gecko.client';
import { Timer } from '../../providers/utils.provider';

@Injectable()
export class SyncPriceService {
  constructor(
    private readonly coinGeckoClient: CoinGeckoClient,
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistModel>,
  ) {}

  async syncAllWhitelistCurrencyPrice() {
    const timer = new Timer('Sync all whitelist currency price');

    timer.start();
    const whitelists = await this.whiteListRepo.find({});

    if (whitelists.length == 0) return;

    /** Fetch prices */
    const pricing = await this.coinGeckoClient.getPriceInCurrencies(
      whitelists.map(({ address }) => address),
      ['usd'],
    );

    /** Map prices */
    let syncedTokenPrice = 0;

    for (const whitelist of whitelists) {
      /**
       * @dev Check for condition to sync the price
       */
      if (pricing[whitelist.address]) {
        whitelist.estimatedValue = pricing[whitelist.address].usd;
        syncedTokenPrice++;
      } else {
        console.error(
          `Cannot sync price of token: ${whitelist.symbol}, address: ${whitelist.address}`,
        );
      }
    }

    /** Update DB */
    await this.whiteListRepo.bulkSave(whitelists);
    console.log(
      `Whitelist token synced: ${syncedTokenPrice}/${whitelists.length}`,
    );
    timer.stop();
  }
}
