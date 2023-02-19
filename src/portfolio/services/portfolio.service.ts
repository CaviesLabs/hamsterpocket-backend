import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PoolModel, PoolDocument } from '../../orm/model/pool.model';

export class PortfolioService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async updateByOwnerAddress(ownerAddress: string) {
    // TODO: Implement service
    throw new Error(`Not implement yet! ${ownerAddress}`);
  }
}
