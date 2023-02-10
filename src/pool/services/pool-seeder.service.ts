import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PoolEntity } from '../entities/pool.entity';
import { RegistryProvider } from '../../providers/registry.provider';
import { PoolDocument } from '../../orm/model/pool.model';

@Injectable()
export class PoolSeederService implements OnApplicationBootstrap {
  constructor(
    private readonly registry: RegistryProvider,
    @InjectModel(PoolEntity.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async onApplicationBootstrap() {
    console.log('PoolSeederService');

    // TODO: update this dummy
    await this.poolRepo.create({}, {}, {});
  }
}
