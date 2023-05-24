import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { ChainID, PoolEntity, PoolStatus } from '../entities/pool.entity';
import { SolanaPoolProvider } from '../../providers/solana-pocket-program/solana-pool.provider';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';
import { SyncPoolActivityService } from './sync-pool-activity.service';

@Injectable()
export class SyncPoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,

    private readonly poolActivityService: SyncPoolActivityService,
  ) {}

  async syncPoolById(poolId: string) {
    const pool = await this.poolRepo.findById(poolId);
    if (!pool || pool.chainId !== ChainID.Solana) return;

    const data = await this.onChainPoolProvider.fetchFromContract(poolId);

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        ...data,
      },
      {
        upsert: true,
      },
    );

    await this.poolActivityService.syncPoolActivities(poolId, true);
  }

  async syncPools() {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find(
      {
        chainId: ChainID.Solana,
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
      { _id: 1, status: 1, chainId: 1 },
    );

    /**
     * @dev Sync all pools
     */
    const syncedPools = await Promise.all(
      poolIds.map(async (pool) => {
        try {
          /** Fetch pool latest update */
          const syncedPool = await this.onChainPoolProvider.fetchFromContract(
            pool.id,
          );

          /**
           * @dev Convert to instance
           */
          return plainToInstance(PoolEntity, {
            ...syncedPool,
          });
        } catch (e) {
          console.log('FAILED_TO_SYNC_POOL:', pool.id, e.message);
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

    await Promise.all(
      poolIds.map(({ id }) =>
        this.poolActivityService.syncPoolActivities(id.toString()),
      ),
    );

    timer.stop();
  }

  async syncPoolsByOwnerAddress(ownerAddress: string) {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find(
      {
        ownerAddress,
        chainId: ChainID.Solana,
      },
      { id: 1, status: 1 },
    );

    console.log(`Found ${poolIds.length} pocket(s) for ${ownerAddress}`);

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

    // sync activities
    await Promise.all(
      poolIds.map(({ id }) =>
        this.poolActivityService.syncPoolActivities(id.toString(), true),
      ),
    );

    timer.stop();
  }
}
