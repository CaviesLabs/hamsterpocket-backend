import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RegistryProvider } from '../../providers/registry.provider';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';

@Injectable()
export class PoolSeederService implements OnApplicationBootstrap {
  constructor(
    private readonly registry: RegistryProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async onApplicationBootstrap() {
    // TODO: update this dummy
    await this.poolRepo.create(
      { name: 'Pool 1', paxAmount: 1 },
      { name: 'Pool 2', paxAmount: 2 },
      { name: 'Pool 3', paxAmount: 3 },
    );
  }
}
