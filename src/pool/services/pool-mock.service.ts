import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { PoolEntity } from '../entities/pool.entity';

const poolTemplate: Partial<PoolEntity> = {
  // TODO: implement
};

@Injectable()
export class PoolMockService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  generate(ownerAddress: string) {
    return this.poolRepo.create({
      ...poolTemplate,
      ownerAddress,
    });
  }
}
