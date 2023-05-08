import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { ChainID, PoolStatus } from '../entities/pool.entity';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';
import { EVMPocketConverter } from '../../providers/evm-pocket-program/evm.converter';

@Injectable()
export class SyncEvmPoolService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
  ) {}

  /**
   * @dev Sync pool by id
   * @param poolId
   */
  async syncPoolById(poolId: string) {
    const timer = new Timer('Sync single pool');
    timer.start();

    const pool = await this.poolRepo.findById(poolId);
    if (!pool || pool.chainId === ChainID.Solana) return;

    const data = await new EVMPocketConverter(pool.chainId).fetchPocketEntity(
      poolId,
    );
    if (!data) throw new NotFoundException('POCKET_NOT_INITIALIZED');

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        ...data,
      },
      {
        upsert: true,
      },
    );

    timer.stop();
  }

  /**
   * @dev Sync all pools
   */
  async syncPools() {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const data = await this.poolRepo.aggregate([
      {
        $match: {
          chainId: {
            $ne: ChainID.Solana,
          },
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
      },
      {
        $group: {
          _id: '$chainId',
          idList: {
            $push: '$_id',
          },
        },
      },
    ]);

    await Promise.all(
      data.map(async ({ _id: chainId, idList: poolIds }) => {
        console.log(`Found ${poolIds.length} pocket(s) for syncing ...`);

        const pools = await new EVMPocketConverter(
          chainId,
        ).fetchMultiplePockets(poolIds.map((poolIds) => poolIds.toString()));

        await this.poolRepo.bulkWrite(
          pools
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
      }),
    );

    timer.stop();
  }

  /**
   * @dev Sync all pools for an owner
   * @param ownerAddress
   */
  async syncPoolsByOwnerAddress(ownerAddress: string) {
    const timer = new Timer('Sync pools by owner address');
    timer.start();

    /** Only pick _id and status */
    const data = await this.poolRepo.aggregate([
      {
        $match: {
          ownerAddress,
          chainId: {
            $ne: ChainID.Solana,
          },
        },
      },
      {
        $group: {
          _id: '$chainId',
          idList: {
            $push: '$_id',
          },
        },
      },
    ]);

    await Promise.all(
      data.map(async ({ _id: chainId, idList: poolIds }) => {
        console.log(`Found ${poolIds.length} pocket(s) for ${ownerAddress}`);

        const pools = await new EVMPocketConverter(
          chainId,
        ).fetchMultiplePockets(poolIds.map((poolIds) => poolIds.toString()));

        await this.poolRepo.bulkWrite(
          pools
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
      }),
    );

    timer.stop();
  }
}
