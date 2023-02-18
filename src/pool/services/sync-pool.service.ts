import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { plainToInstance } from 'class-transformer';
import { Duration } from 'luxon';
import { Model } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { PoolEntity, PoolStatus } from '../entities/pool.entity';
import { SolanaPoolProvider } from '../providers/solana-pool.provider';
import { BuyTokenJobData, POOL_QUEUE } from '../queues/pool.processor';

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
      limit = pool.stopConditions.baseTokenReach - pool.currentBatchAmount;
    }

    /** Publish repeatable job */
    await this.buyTokenQueue.add(pool.id, {
      /** Use pool ID as jobId to upsert queue event */
      jobId: pool.id,
      /** data type: string, no need to parse */
      preventParsingData: true,
      repeat: {
        startDate: pool.startTime,
        every: frequency,
        endDate: pool.stopConditions?.endTime,
        limit,
      },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncPools() {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find(
      {
        status: {
          $in: [PoolStatus.CREATED, PoolStatus.ACTIVE, PoolStatus.PAUSED],
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
        /** Fetch pool latest update */
        const syncedPool = await this.onChainPoolProvider.fetchFromContract(id);

        /** Publish a job for new pool */
        if (status === PoolStatus.CREATED) {
          await this.scheduleJob(syncedPool);
        }

        return plainToInstance(PoolModel, syncedPool);
      }),
    );

    await this.poolRepo.bulkSave(syncedPools);

    timer.stop();
  }
}
