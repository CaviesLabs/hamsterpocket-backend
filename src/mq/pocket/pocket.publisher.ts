import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Duration } from 'luxon';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { PORTFOLIO_QUEUE } from '../dto/portfolio.queue';
import { PoolEntity } from '../../pool/entities/pool.entity';
import { BUY_TOKEN_PROCESS, POOL_QUEUE, SYNC_POCKETS } from '../dto/pool.queue';

@Injectable()
export class PocketPublisher implements OnApplicationBootstrap {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectQueue(PORTFOLIO_QUEUE)
    private readonly portfolioQueue: Queue,
    @InjectQueue(POOL_QUEUE)
    private readonly pocketQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.syncPocket().catch((e) =>
      console.log('ERROR::FAILED_TO_SYNC_POCKET', e),
    );
    // this.executeSwap().catch(e => console.log("ERROR::FAILED_TO_EXECUTE_SWAP", e));
  }

  async executeSwap(pool: PoolEntity) {
    /** Calculate job repeat options */
    const frequency = Duration.fromObject(pool.frequency).toMillis();
    let limit: number = undefined;
    if (pool.stopConditions?.batchAmountReach) {
      limit = pool.stopConditions.spentBaseTokenReach - pool.currentBatchAmount;
    }

    /** Publish repeatable job */
    await this.pocketQueue.add(
      BUY_TOKEN_PROCESS,
      {
        poolId: pool.id,
      },
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: pool.id,
        repeat: {
          startDate: pool.startTime,
          every: frequency,
          endDate: pool.stopConditions?.endTime,
          limit,
        },
      },
    );
  }

  async syncPocket() {
    /** Publish repeatable job */
    console.log('Started syncing pockets');

    /**
     * @dev Add a task to the queue
     */
    await this.pocketQueue.add(
      SYNC_POCKETS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: SYNC_POCKETS,
        repeat: {
          startDate: new Date(),
          every: Duration.fromObject({
            minutes: 5,
          }).toMillis(),
        },
      },
    );
  }
}
