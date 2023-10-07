import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ChainID, PoolStatus } from '../entities/pool.entity';
import { PoolDocument, PoolModel } from '@/orm/model/pool.model';
import { Timer } from '@/providers/utils.provider';
import { WhitelistDocument, WhitelistModel } from '@/orm/model/whitelist.model';
import { PocketIndexer } from '@/providers/aptos-program/pocket.indexer';
import { RegistryProvider } from '@/providers/registry.provider';

@Injectable()
export class SyncAptosPoolService {
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
  public async syncPoolById(poolId: string) {
    const timer = new Timer('Sync single aptos pool');
    timer.start();

    const pool = await this.poolRepo.findById(poolId);
    if (
      !pool ||
      (pool.chainId !== ChainID.AptosTestnet &&
        pool.chainId !== ChainID.AptosMainnet)
    )
      return;

    const indexer = new PocketIndexer(
      pool.chainId as ChainID.AptosMainnet | ChainID.AptosTestnet,
      this.poolRepo,
      this.whitelistRepo,
      new RegistryProvider(),
    );

    const [data] = await indexer.fetchPockets([poolId]);
    if (!data) throw new NotFoundException('POCKET_NOT_INITIALIZED');

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        $set: { ...data },
      },
      {
        upsert: true,
      },
    );

    // fetching quote after syncing
    const quote = await indexer.calculateSingleROIAndAvgPrice(poolId);
    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        $set: { ...quote },
      },
      {
        upsert: true,
      },
    );

    timer.stop();
  }

  /**
   * @dev Sync all pools for an owner
   * @param ownerAddress
   * @param chainId
   */
  public async syncPoolsByOwnerAddress(ownerAddress: string, chainId: ChainID) {
    const timer = new Timer(
      `Sync aptos pools by owner address ${ownerAddress}`,
    );
    timer.start();

    /** Only pick _id and status */
    const data = await this.poolRepo.aggregate([
      {
        $match: {
          ownerAddress,
          $and: [{ chainId }],
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
      data.map(async ({ _id: chainId, idList: poolIds }) =>
        this.syncMultiplePools(poolIds, chainId),
      ),
    );

    timer.stop();
  }

  /**
   * @dev Sync all pools
   */
  public async syncPools() {
    const timer = new Timer('Sync All Pools');
    timer.start();

    /** Only pick _id and status */
    const data = await this.poolRepo.aggregate([
      {
        $match: {
          chainId: {
            $in: [ChainID.AptosMainnet],
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
      data.map(async ({ _id: chainId, idList: poolIds }) =>
        this.syncMultiplePools(poolIds, chainId),
      ),
    );

    timer.stop();
  }

  private async syncMultiplePools(
    poolIds: string[],
    chainId: ChainID.AptosMainnet | ChainID.AptosTestnet,
  ) {
    console.log(
      `Found ${poolIds.length} aptos pocket(s) for syncing, on chain ${chainId} ...`,
    );

    const indexer = new PocketIndexer(
      chainId,
      this.poolRepo,
      this.whitelistRepo,
      new RegistryProvider(),
    );

    let pools = await indexer.fetchPockets(
      poolIds.map((poolIds) => poolIds.toString()),
    );
    pools = pools.filter((pool) => !!pool);

    if (pools.length === 0) {
      console.log(`No valid pools for ${chainId}, skipped ...`);
      return;
    } else {
      console.log(
        `Found ${pools.length} valid pool(s) for ${chainId}, processing ...`,
      );
    }

    // upsert
    await this.poolRepo.bulkWrite(
      pools.map((pool) => {
        return {
          updateOne: {
            filter: { _id: new Types.ObjectId(pool.id) },
            update: {
              $set: { ...pool },
            },
            upsert: true,
          },
        };
      }),
    );

    // update quotes
    await Promise.all(
      pools.map(async (pool) => {
        const quote = await indexer.calculateSingleROIAndAvgPrice(
          pool.id.toString(),
        );
        await this.poolRepo.updateOne(
          { _id: new Types.ObjectId(pool.id) },
          {
            $set: { ...quote },
          },
          {
            upsert: true,
          },
        );
      }),
    );
  }
}
