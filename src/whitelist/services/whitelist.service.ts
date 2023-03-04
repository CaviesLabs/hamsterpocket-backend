import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WhitelistModel } from '../../orm/model/whitelist.model';

@Injectable()
export class WhitelistService {
  constructor(
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistModel>,
  ) {}

  async getAll() {
    return this.whiteListRepo.find({});
  }
}
