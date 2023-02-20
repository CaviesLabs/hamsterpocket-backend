import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultWhitelists } from '../../assets/whitelists.default';

import { WhitelistModel } from '../../orm/model/whitelist.model';
import { SyncPriceService } from './sync-price.service';

@Injectable()
export class WhitelistService implements OnApplicationBootstrap {
  constructor(
    private readonly syncPriceService: SyncPriceService,
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistModel>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedingDB();
  }

  private async seedingDB() {
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
    await this.syncPriceService.syncAllWhitelistCurrencyPrice();
  }

  async getAll() {
    return await this.whiteListRepo.find({});
  }
}
