import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WhitelistModel } from '../../orm/model/whitelist.model';
import { MarketModel } from '../../orm/model/market.model';

@Injectable()
export class WhitelistService {
  constructor(
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistModel>,

    @InjectModel(MarketModel.name)
    private readonly marketDataRepo: Model<MarketModel>,
  ) {}

  async getAll() {
    return this.whiteListRepo.find({});
  }

  getMarkets() {
    return this.marketDataRepo.find();
  }
}
