import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BigNumber } from 'ethers';

import { PoolDocument, PoolModel } from '@/orm/model/pool.model';
import { Timer } from '@/providers/utils.provider';
import { ChainID, PoolStatus, StoppedChains } from '../entities/pool.entity';
import { WhitelistDocument, WhitelistModel } from '@/orm/model/whitelist.model';
import { EVMIndexer } from '@/providers/evm-pocket-program/evm.indexer';

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
    if (
      !pool ||
      pool.chainId === ChainID.Solana ||
      StoppedChains.includes(pool.chainId)
    )
      return;

    const indexer = new EVMIndexer(
      pool.chainId,
      this.poolRepo,
      this.whitelistRepo,
    );

    const data = await indexer.fetchPocketEntity(poolId);
    if (!data) throw new NotFoundException('POCKET_NOT_INITIALIZED');

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        $set: {
          ...data,
        },
      },
      {
        upsert: true,
      },
    );

    const roiAndAvgPrice = await indexer.calculateSingleROIAndAvgPrice(poolId);

    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(data.id) },
      {
        $set: {
          ...data,
          avgPrice: roiAndAvgPrice.avgPrice,
          currentROI: roiAndAvgPrice.roi,
          currentROIValue: roiAndAvgPrice.roiValue,
          realizedROI: roiAndAvgPrice.realizedROI,
          realizedROIValue: roiAndAvgPrice.realizedROIValue,
        },
      },
      {
        upsert: true,
      },
    );

    timer.stop();
  }

  private async syncMultiplePools(poolIds: string[], chainId: ChainID) {
    console.log(
      `Found ${poolIds.length} evm pocket(s) for syncing, on chain ${chainId} ...`,
    );

    const indexer = new EVMIndexer(chainId, this.poolRepo, this.whitelistRepo);

    let pools = await indexer.fetchMultiplePockets(
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

    const quotes = await indexer.calculateMultipleROIAndAvg(
      pools.map((elm) => ({
        pocketId: elm.id.toString(),
        baseTokenAddress: elm.baseTokenAddress,
        targetTokenAddress: elm.targetTokenAddress,
        ammRouterAddress: elm.ammRouterAddress,
        amount: BigNumber.from(
          `0x${(elm.currentReceivedTargetToken || 0).toString(16)}`,
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
                currentROIValue: quotes[index].roiValue,
                realizedROI: quotes[index].realizedROI,
                realizedROIValue: quotes[index].realizedROIValue,
              },
            },
            upsert: true,
          },
        };
      }),
    );
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
          $and: [
            { chainId: { $ne: ChainID.Solana } },
            { chainId: { $ne: ChainID.AptosTestnet } },
            { chainId: { $ne: ChainID.AptosMainnet } },
            { chainId: { $nin: StoppedChains } },
          ],
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

  /**
   * @dev Sync all pools for an owner
   * @param ownerAddress
   * @param chainId
   */
  async syncPoolsByOwnerAddress(ownerAddress: string, chainId: ChainID) {
    const timer = new Timer(`Sync evm pools by owner address ${ownerAddress}`);
    timer.start();

    /** Only pick _id and status */
    const data = await this.poolRepo.aggregate([
      {
        $match: {
          ownerAddress,
          $and: [
            { chainId },
            {
              $and: [
                { chainId: { $ne: ChainID.Solana } },
                { chainId: { $ne: ChainID.AptosTestnet } },
                { chainId: { $ne: ChainID.AptosMainnet } },
                { chainId: { $nin: StoppedChains } },
              ],
            },
          ],
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
}
