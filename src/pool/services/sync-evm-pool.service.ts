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
import { EVMIndexer } from '../../providers/evm-pocket-program/evm.indexer';
import { BigNumber } from 'ethers';

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
    const timer = new Timer('Sync single evm pool');
    timer.start();

    const pool = await this.poolRepo.findById(poolId);
    if (!pool || pool.chainId === ChainID.Solana) return;

    const indexer = new EVMIndexer(
      pool.chainId,
      this.poolRepo,
      this.whitelistRepo,
    );

    const data = await indexer.fetchPocketEntity(poolId);
    if (!data) throw new NotFoundException('POCKET_NOT_INITIALIZED');

    const roiAndAvgPrice = await indexer.calculateSingleROIAndAvgPrice(poolId);
    console.log({ roiAndAvgPrice });

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        $set: {
          ...data,
          avgPrice: roiAndAvgPrice.avgPrice,
          currentROI: roiAndAvgPrice.roi,
        },
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
        console.log(
          `Found ${poolIds.length} evm pocket(s) for syncing, on chain ${chainId} ...`,
        );

        const indexer = new EVMIndexer(
          chainId,
          this.poolRepo,
          this.whitelistRepo,
        );

        const pools = await indexer.fetchMultiplePockets(
          poolIds.map((poolIds) => poolIds.toString()),
        );
        pools.filter((pool) => !!pool);

        const poolData = await this.poolRepo.find({
          _id: {
            $in: pools.map((pool) => pool.id),
          },
        });
        const quotes = await indexer.calculateMultipleROIAndAvg(
          poolData.map((elm) => ({
            pocketId: elm._id.toString(),
            baseTokenAddress: elm.baseTokenAddress,
            targetTokenAddress: elm.targetTokenAddress,
            amount: BigNumber.from(
              (elm.currentReceivedTargetToken || 0).toString(),
            ),
          })),
        );

        await this.poolRepo.bulkWrite(
          pools.map((pool, index) => {
            return {
              updateOne: {
                filter: { _id: new Types.ObjectId(pool.id) },
                update: {
                  $set: {
                    ...pool,
                    avgPrice: quotes[index].avgPrice,
                    currentROI: quotes[index].roi,
                  },
                },
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
    const timer = new Timer('Sync evm pools by owner address');
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
        console.log(
          `Found ${poolIds.length} evm pocket(s) for ${ownerAddress}`,
        );
        const indexer = new EVMIndexer(
          chainId,
          this.poolRepo,
          this.whitelistRepo,
        );

        const pools = await indexer.fetchMultiplePockets(
          poolIds.map((poolIds) => poolIds.toString()),
        );
        pools.filter((pool) => !!pool);

        const poolData = await this.poolRepo.find({
          _id: {
            $in: pools.map((pool) => pool.id),
          },
        });
        const quotes = await indexer.calculateMultipleROIAndAvg(
          poolData.map((elm) => ({
            pocketId: elm._id.toString(),
            baseTokenAddress: elm.baseTokenAddress,
            targetTokenAddress: elm.targetTokenAddress,
            amount: BigNumber.from(
              (elm.currentReceivedTargetToken || 0).toString(),
            ),
          })),
        );

        await this.poolRepo.bulkWrite(
          pools.map((pool, index) => {
            return {
              updateOne: {
                filter: { _id: new Types.ObjectId(pool.id) },
                update: {
                  $set: {
                    ...pool,
                    avgPrice: quotes[index].avgPrice,
                    currentROI: quotes[index].roi,
                  },
                },
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
