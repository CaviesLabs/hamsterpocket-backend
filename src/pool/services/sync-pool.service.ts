import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { PoolEntity, PoolStatus } from '../entities/pool.entity';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';

@Injectable()
export class SyncPoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
  ) {}

  async syncPoolById(poolId: string) {
    const existedPool = await this.poolRepo.findById(poolId);
    /** No need to sync ended pool */
    if (existedPool.status === PoolStatus.ENDED) return;

    /** Fetch pool latest update */
    const syncedPool = await this.onChainPoolProvider.fetchFromContract(poolId);

    const baseToken = (await this.whitelistRepo.findOne({
      address: syncedPool.baseTokenAddress,
    })) || { symbol: undefined };
    const targetToken = (await this.whitelistRepo.findOne({
      address: syncedPool.targetTokenAddress,
    })) || { symbol: undefined };

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(syncedPool.id) },
      {
        ...syncedPool,
        textIndex: `${syncedPool.name}-${syncedPool.address}-${syncedPool.id}-${
          syncedPool.baseTokenAddress
        }-${syncedPool.targetTokenAddress}-${baseToken.symbol || ''}-${
          targetToken.symbol || ''
        }`,
      },
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
      { _id: 1, status: 1 },
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
          const baseToken = (await this.whitelistRepo.findOne({
            address: syncedPool.baseTokenAddress,
          })) || { symbol: undefined };
          const targetToken = (await this.whitelistRepo.findOne({
            address: syncedPool.targetTokenAddress,
          })) || { symbol: undefined };

          return plainToInstance(PoolEntity, {
            ...syncedPool,
            textIndex: `${syncedPool.name}-${syncedPool.address}-${
              syncedPool.id
            }-${syncedPool.baseTokenAddress}-${syncedPool.targetTokenAddress}-${
              baseToken.symbol || ''
            }-${targetToken.symbol || ''}`,
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

    timer.stop();
  }

  async syncPoolsByOwnerAddress(ownerAddress: string) {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find(
      {
        ownerAddress,
        status: {
          $in: [
            PoolStatus.CREATED,
            PoolStatus.ACTIVE,
            PoolStatus.PAUSED,
            PoolStatus.CLOSED,
          ],
        },
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

    timer.stop();
  }
}
