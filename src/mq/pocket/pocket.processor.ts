import { Processor, Process } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  POOL_QUEUE,
  BUY_TOKEN_PROCESS,
  SYNC_POCKETS,
  BUY_EVM_TOKEN_PROCESS,
  CLOSE_EVM_POSITION_PROCESS,
  SYNC_EVM_POCKETS,
} from '../dto/pool.queue';

import { PoolService } from '../../pool/services/pool.service';
import { SyncPoolService } from '../../pool/services/sync-pool.service';
import { ChainID, PoolStatus } from '../../pool/entities/pool.entity';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { MarketModel } from '../../orm/model/market.model';
import { SyncEvmPoolService } from '../../pool/services/sync-evm-pool.service';

@Processor(POOL_QUEUE)
export class PocketProcessor {
  constructor(
    private readonly poolService: PoolService,
    private readonly syncService: SyncPoolService,
    private readonly evmSyncService: SyncEvmPoolService,

    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectModel(MarketModel.name)
    private readonly marketDataRepo: Model<MarketModel>,
  ) {}
  @Process(BUY_TOKEN_PROCESS)
  async buyTokenJob() {
    try {
      const whitelistedMarketIds = await this.marketDataRepo.find(
        {},
        {
          marketId: 1,
        },
      );

      /**
       * @dev Filter all proper pools
       */
      const pools = await this.poolRepo
        .find({
          marketKey: {
            $in: whitelistedMarketIds.map((elm) => elm.marketId),
          },
          status: PoolStatus.ACTIVE,
          chainId: ChainID.Solana,

          /**
           * @dev Date filtering
           */
          nextExecutionAt: {
            $lte: new Date(),
          },
          startTime: {
            $lte: new Date(),
          },
        })
        .exec();

      console.log(
        `[${BUY_TOKEN_PROCESS}] Found ${pools.length} pocket(s) ready to swap ...`,
      );

      /**
       * @dev Execute jobs
       */
      await Promise.all(
        pools.map((pool) => {
          return this.poolService
            .executeSwapToken(pool._id.toString())
            .catch((e) => console.log(`[${BUY_TOKEN_PROCESS}]`, e))
            .then(() =>
              console.log(
                `[${BUY_TOKEN_PROCESS}] Executed swap for ${pool.id}`,
              ),
            );
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Process(BUY_EVM_TOKEN_PROCESS)
  async buyEVMTokenJob() {
    try {
      /**
       * @dev Filter all proper pools
       */
      const pools = await this.poolRepo
        .find({
          chainId: {
            $ne: ChainID.Solana,
          },
          status: PoolStatus.ACTIVE,
          /**
           * @dev Date filtering
           */
          nextExecutionAt: {
            $lte: new Date(),
          },
          startTime: {
            $lte: new Date(),
          },
        })
        .exec();

      console.log(
        `[${BUY_EVM_TOKEN_PROCESS}] Found ${pools.length} pocket(s) ready to swap ...`,
      );

      /**
       * @dev Execute jobs
       */
      await Promise.all(
        pools.map((pool) => {
          /**
           * @dev Execute on EVM
           */
          return this.poolService
            .executeSwapTokenOnEVM(pool._id.toString(), pool.chainId)
            .catch((e) => console.log(`[${BUY_EVM_TOKEN_PROCESS}]`, e))
            .then(() =>
              console.log(
                `[${BUY_EVM_TOKEN_PROCESS}] Executed swap for ${pool.id}`,
              ),
            );
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Process(CLOSE_EVM_POSITION_PROCESS)
  async closeEVMPositions() {
    try {
      /**
       * @dev Filter all proper pools
       */
      const pools = await this.poolRepo
        .find({
          chainId: {
            $ne: ChainID.Solana,
          },
          status: {
            $ne: PoolStatus.ENDED,
          },
          /**
           * @dev Date filtering
           */
          currentTargetTokenBalance: {
            $gt: 0,
          },
          startTime: {
            $lte: new Date(),
          },
        })
        .exec();

      console.log(
        `[${CLOSE_EVM_POSITION_PROCESS}] Found ${pools.length} pocket(s) ready to swap ...`,
      );

      /**
       * @dev Execute jobs
       */
      await Promise.all(
        pools.map((pool) => {
          /**
           * @dev Execute on EVM
           */
          return this.poolService
            .executeClosingPositionOnEVM(pool._id.toString(), pool.chainId)
            .catch((e) => console.log(`[${CLOSE_EVM_POSITION_PROCESS}]`, e))
            .then(() =>
              console.log(
                `[${CLOSE_EVM_POSITION_PROCESS}] Executed swap for ${pool.id}`,
              ),
            );
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Process(SYNC_POCKETS)
  async syncPockets() {
    console.log(`[${SYNC_POCKETS}] Started syncing solana & evm pools ...`);

    try {
      await this.syncService.syncPools();
    } catch (e) {
      console.log('ERROR::JOB_FAILED_TO_SYNC_POCKETS', e);
    }
  }

  @Process(SYNC_EVM_POCKETS)
  async syncEVMPockets() {
    console.log(`[${SYNC_POCKETS}] Started syncing solana & evm pools ...`);

    try {
      await this.evmSyncService.syncPools();
    } catch (e) {
      console.log('ERROR::JOB_FAILED_TO_SYNC_POCKETS', e);
    }
  }
}
