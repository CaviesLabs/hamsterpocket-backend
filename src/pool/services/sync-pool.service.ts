import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';

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
  ) {}

  async syncPoolById(poolId: string) {
    const existedPool = await this.poolRepo.findById(poolId);
    /** No need to sync ended pool */
    if (existedPool.status === PoolStatus.ENDED) return;

    /** Fetch pool latest update */
    const syncedPool = await this.onChainPoolProvider.fetchFromContract(poolId);

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(syncedPool.id) },
      syncedPool,
      {
        upsert: true,
      },
    );
  }

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
      poolIds.map(async ({ id }) => {
        try {
          /** Fetch pool latest update */
          const syncedPool = await this.onChainPoolProvider.fetchFromContract(
            id,
          );

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
