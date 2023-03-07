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
} from '../../mq/dto/pool.queue';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { PoolEntity, PoolStatus } from '../entities/pool.entity';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';
import {
  POOL_ACTIVITY_QUEUE,
  SYNC_POOL_ACTIVITY,
} from '../../mq/dto/pool-activity.queue';

@Injectable()
export class SyncPoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectQueue(POOL_QUEUE)
    private readonly buyTokenQueue: Queue<BuyTokenJobData>,
    @InjectQueue(POOL_ACTIVITY_QUEUE)
    private readonly poolActivityQueue: Queue<BuyTokenJobData>,
  ) {}

  async scheduleExecutePoolJob(pool: PoolEntity) {
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

  async publishSyncPoolActivityEvent(poolId: string) {
    await this.poolActivityQueue.add(
      SYNC_POOL_ACTIVITY,
      { poolId },
      { jobId: poolId },
    );
  }

  async syncPoolById(poolId: string) {
    const existedPool = await this.poolRepo.findById(poolId);
    /** No need to sync ended pool */
    if (existedPool.status === PoolStatus.ENDED) return;

    /** Fetch pool latest update */
    const syncedPool = await this.onChainPoolProvider.fetchFromContract(poolId);

    /** Publish a job for new pool */
    if (syncedPool.status === PoolStatus.ACTIVE) {
      await this.scheduleExecutePoolJob(syncedPool);
    }

    /** Publish sync pool activity event */
    await this.publishSyncPoolActivityEvent(poolId);

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
            await this.scheduleExecutePoolJob(syncedPool);
          }

          /** Publish sync pool activity event */
          await this.publishSyncPoolActivityEvent(id);

          /**
           * @dev Convert to instance
           */
          return plainToInstance(PoolEntity, syncedPool);
        } catch (e) {
          console.error(e);
          return null;
        }
      }),
    );

    await this.poolRepo.bulkWrite(
      syncedPools
        .filter((pool) => !!pool)
        .map((pool) => {
          return {
            updateOne: {
              filter: { _id: new Types.ObjectId(pool.id) },
              update: pool,
              upsert: true,
            },
          };
        }),
    );

    timer.stop();
  }
}
