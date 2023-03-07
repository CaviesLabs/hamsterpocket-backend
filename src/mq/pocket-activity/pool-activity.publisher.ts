import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  POOL_ACTIVITY_QUEUE,
  SYNC_POOL_ACTIVITY,
} from '../dto/pool-activity.queue';

@Injectable()
export class PoolActivityPublisher implements OnApplicationBootstrap {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectQueue(POOL_ACTIVITY_QUEUE)
    private readonly poolActivityQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    console.log('TODO: implement sync pool flow again');
  }

  async publishSyncPoolActivityEvent(poolId: string) {
    await this.poolActivityQueue.add(
      SYNC_POOL_ACTIVITY,
      { poolId },
      { jobId: poolId },
    );
  }
}
