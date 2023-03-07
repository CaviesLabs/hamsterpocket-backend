import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import { Model } from 'mongoose';

import { WhitelistModel } from '../../orm/model/whitelist.model';
import { CoinGeckoClient } from '../../providers/coin-gecko.client';
import { Timer } from '../../providers/utils.provider';
import { WhitelistEntity } from '../entities/whitelist.entity';

@Injectable()
export class SyncPriceService implements OnApplicationBootstrap {
  constructor(
    private readonly coinGeckoClient: CoinGeckoClient,
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistModel>,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
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

  async onApplicationBootstrap() {
    await this.seedingDB();
  }

  private async seedingDB() {
    const raw = fs.readFileSync('./src/assets/raydium.whitelist.json');
    const defaultWhitelists: WhitelistEntity[] = JSON.parse(raw.toString());

    /** Upsert every deployed */
    await this.whiteListRepo.bulkWrite(
      defaultWhitelists.map((data) => ({
        updateOne: {
          filter: { address: data.address },
          update: data,
          upsert: true,
        },
      })),
    );

    /** trigger sync prices */
    await this.syncAllWhitelistCurrencyPrice();
  }
}
