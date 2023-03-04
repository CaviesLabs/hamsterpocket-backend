import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { plainToInstance } from 'class-transformer';
import { Duration } from 'luxon';
import { Model, Types } from 'mongoose';

import {
  POOL_QUEUE,
  BuyTokenJobData,
  BUY_TOKEN_PROCESS,
} from '../../mq/queues/pool.queue';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { PoolEntity, PoolStatus } from '../entities/pool.entity';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';

@Injectable()
export class SyncPoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectQueue(POOL_QUEUE)
    private readonly buyTokenQueue: Queue<BuyTokenJobData>,
  ) {}

  async scheduleJob(pool: PoolEntity) {
    /** Calculate job repeat options */
    const frequency = Duration.fromObject(pool.frequency).toMillis();
    let limit: number = undefined;
    if (pool.stopConditions?.batchAmountReach) {
      limit = pool.stopConditions.spentBaseTokenReach - pool.currentBatchAmount;
    }

    /** Publish repeatable job */
    await this.buyTokenQueue.add(
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

  async syncPoolById(poolId: string) {
    const existedPool = await this.poolRepo.findById(poolId);
    /** No need to sync ended pool */
    if (existedPool.status === PoolStatus.ENDED) return;
    console.log('line 61');
    /** Fetch pool latest update */
    const syncedPool = await this.onChainPoolProvider.fetchFromContract(poolId);

    console.log('line 65');
    /** Publish a job for new pool */
    if (syncedPool.status === PoolStatus.ACTIVE) {
      await this.scheduleJob(syncedPool);
    }

    console.log('line 71');
    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(syncedPool.id) },
      syncedPool,
      {
        upsert: true,
      },
    );
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncPools() {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find(
      {
        status: {
          $in: [
            PoolStatus.CREATED,
            PoolStatus.ACTIVE,
            PoolStatus.PAUSED,
            PoolStatus.CLOSED,
          ],
        },
        updatedAt: {
          $gte: timer.startedAt.minus({ weeks: 1 }).toJSDate(),
          $lt: timer.startedAt.minus({ minutes: 5 }).toJSDate(),
        },
      },
      { id: 1, status: 1 },
    );
    const syncedPools = await Promise.all(
      poolIds.map(async ({ id, status }) => {
        try {
          /** Fetch pool latest update */
          const syncedPool = await this.onChainPoolProvider.fetchFromContract(
            id,
          );

          /** Publish a job for new pool */
          if (status === PoolStatus.ACTIVE) {
            await this.scheduleJob(syncedPool);
          }

          return plainToInstance(PoolModel, syncedPool);
        } catch (e) {
          console.error(e);
          return null;
        }
      }),
    );

    await this.poolRepo.bulkSave(syncedPools.filter((pool) => !!pool));

    timer.stop();
  }
}
