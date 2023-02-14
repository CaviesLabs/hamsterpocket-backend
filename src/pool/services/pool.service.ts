import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import { FindPoolDto } from '../dtos/find-pool.dto';

export class PoolService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  find({ search, limit, offset, ownerAddress }: CommonQueryDto & FindPoolDto) {
    const filter: FilterQuery<PoolDocument> = {
      ownerAddress,
    };

    if (search) {
      filter.$text = { $search: search };
    }

    return this.poolRepo.find(filter).limit(limit).skip(offset);
  }

  createEmpty() {
    return this.poolRepo.create({});
  }
}
