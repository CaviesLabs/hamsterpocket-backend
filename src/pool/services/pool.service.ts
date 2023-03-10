import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';

import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';
import { FindPoolDto, FindPoolSortOption } from '../dtos/find-pool.dto';
import { PoolEntity } from '../entities/pool.entity';
import { MarketModel } from '../../orm/model/market.model';

@Injectable()
export class PoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(MarketModel.name)
    private readonly marketDataRepo: Model<MarketModel>,
  ) {}

  async find({
    search,
    limit,
    offset,
    ownerAddress,
    sortBy,
    statuses,
  }: CommonQueryDto & FindPoolDto): Promise<PoolEntity[]> {
    const stages: PipelineStage[] = [];
    /** Map pool stage */
    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'baseTokenInfo',
        localField: 'baseTokenAddress',
        foreignField: 'address',
      },
    });

    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'targetTokenInfo',
        localField: 'targetTokenAddress',
        foreignField: 'address',
      },
    });

    /** Filter & search stage */
    const filter: FilterQuery<PoolDocument> = { ownerAddress };

    if (search) {
      const regexSearch = new RegExp(search, 'i');

      /**
       * @dev Base token info
       */
      filter.$or = [
        /**
         * @dev Base token info
         */
        {
          'baseTokenInfo.address': {
            $regex: regexSearch,
          },
        },
        {
          'baseTokenInfo.symbol': {
            $regex: regexSearch,
          },
        },
        {
          'baseTokenInfo.name': {
            $regex: regexSearch,
          },
        },
        /**
         * @dev Target token info
         */
        {
          'targetTokenInfo.address': {
            $regex: regexSearch,
          },
        },
        {
          'targetTokenInfo.symbol': {
            $regex: regexSearch,
          },
        },
        {
          'targetTokenInfo.name': {
            $regex: regexSearch,
          },
        },
        {
          name: {
            $regex: regexSearch,
          },
        },
      ];
    }

    if (statuses && statuses.length >= 0) {
      filter.status = { $in: statuses };
    }

    stages.push({ $match: filter });

    /** Sort stage */
    switch (sortBy) {
      case FindPoolSortOption.DATE_START_DESC:
        stages.push({ $sort: { startTime: -1 } });
        break;
      case FindPoolSortOption.DATE_CREATED_DESC:
        stages.push({ $sort: { createdAt: -1 } });
        break;
      case FindPoolSortOption.PROGRESS_ASC:
      case FindPoolSortOption.PROGRESS_DESC:
        /** Sort progress stage */
        stages.push({
          $sort: {
            progress: sortBy === FindPoolSortOption.PROGRESS_ASC ? 1 : -1,
          },
        });
        break;
    }

    /** Paginate stage */
    stages.push({ $skip: offset }, { $limit: limit });

    return this.poolRepo.aggregate<PoolModel>(stages);
  }

  async createEmpty(ownerAddress: string) {
    const [doc] = await this.poolRepo.create(
      [
        {
          ownerAddress,
        },
      ],
      {
        validateBeforeSave: false,
      },
    );

    return doc;
  }

  async executeSwapToken(poolId: string) {
    console.log('Executing swap for pool', poolId);

    /**
     * @dev Find neccessary data
     */
    const pool = await this.poolRepo.findById(poolId);
    const market = await this.marketDataRepo.findOne({
      marketId: pool.marketKey,
    });

    /**
     * @dev Raise error if we cannot find any associated market
     */
    if (!market) {
      console.log('ERROR_SWAP: INVALID_MARKET, skipped. PoolId:', poolId);
      return;
    }

    /**
     * @dev Trigger swap. TODO: try/catch and log events emitted from swap transaction.
     */
    try {
      const txId = await this.onChainPoolProvider.executeSwapToken({
        pocketId: poolId,
        baseMint: market.baseMint,
        quoteMint: market.quoteMint,
        marketKey: market.marketId,
        marketAuthority: market.marketAuthority,
        marketProgramId: market.marketProgramId,
      });
      console.log('[SWAPPED_SUCCESSFULLY] TxId:', txId);
    } catch (e) {
      throw e;
    } finally {
      /**
       * @dev Sync pool after execute swap
       */
      const syncedPool = await this.onChainPoolProvider.fetchFromContract(
        poolId,
      );
      await this.poolRepo.updateOne(
        { _id: new Types.ObjectId(poolId) },
        syncedPool,
        {
          upsert: true,
        },
      );
    }
  }
}
