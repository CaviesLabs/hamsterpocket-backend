import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';

import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import { SolanaPoolProvider } from '../../providers/solana-pocket-program/solana-pool.provider';
import { FindPoolDto, FindPoolSortOption } from '../dtos/find-pool.dto';
import { ChainID, PoolEntity } from '../entities/pool.entity';
import { MarketModel } from '../../orm/model/market.model';
import { EVMBasedPocketProvider } from '../../providers/evm-pocket-program/evm.provider';
import { SyncEvmPoolService } from './sync-evm-pool.service';

@Injectable()
export class PoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    private readonly syncEVMService: SyncEvmPoolService,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(MarketModel.name)
    private readonly marketDataRepo: Model<MarketModel>,
  ) {}

  async find({
    chainId,
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
      $addFields: {
        idString: {
          $toString: '$_id',
        },
      },
    });

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
    const filter: FilterQuery<PoolDocument> = { ownerAddress, chainId };

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
        {
          idString: {
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
            progressPercent:
              sortBy === FindPoolSortOption.PROGRESS_ASC ? 1 : -1,
          },
        });
        break;
    }

    /** Paginate stage */
    stages.push({ $skip: offset }, { $limit: limit });

    return this.poolRepo.aggregate<PoolModel>(stages);
  }

  /**
   * @dev Create empty pool
   * @param ownerAddress
   * @param chainId
   */
  async createEmpty(ownerAddress: string, chainId: ChainID) {
    const [doc] = await this.poolRepo.create(
      [
        {
          ownerAddress,
          chainId,
          currentReceivedTargetToken: 0,
          currentSpentBaseToken: 0,
        },
      ],
      {
        validateBeforeSave: false,
      },
    );

    return doc;
  }

  /**
   * @dev Get pool details
   * @param id
   */
  async getPoolDetail(id: string) {
    const pool = await this.poolRepo.findById(id);

    if (!pool) {
      throw new NotFoundException('OBJECT_NOT_FOUND');
    }

    return pool;
  }

  /**
   * @dev Execute swap token on EVM
   * @param poolId
   * @param chainId
   */
  async executeSwapTokenOnEVM(poolId: string, chainId: ChainID) {
    try {
      const tx = await new EVMBasedPocketProvider(chainId).tryMakingDCASwap(
        poolId,
      );
      console.log('[SWAPPED_SUCCESSFULLY] TxId:', tx.hash);
    } catch (e) {
      throw e;
    } finally {
      await this.syncEVMService.syncPoolById(poolId);
    }
  }

  /**
   * @dev Execute swap token on EVM
   * @param poolId
   * @param chainId
   */
  async executeClosingPositionOnEVM(poolId: string, chainId: ChainID) {
    try {
      const tx = await new EVMBasedPocketProvider(chainId).tryClosingPosition(
        poolId,
      );
      console.log('[CLOSED_POSITION_SUCCESSFULLY] TxId:', tx.hash);
    } catch (e) {
      throw e;
    } finally {
      /**
       * @dev Sync pool after execute pocket
       */
      await this.syncEVMService.syncPoolById(poolId);
    }
  }

  /**
   * @dev Execute swap token on solana
   * @param poolId
   */
  async executeSwapToken(poolId: string) {
    console.log('Executing pocket for pool', poolId);

    /**
     * @dev Find necessary data
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
     * @dev Trigger pocket. TODO: try/catch and log events emitted from pocket transaction.
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
       * @dev Sync pool after execute pocket
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
