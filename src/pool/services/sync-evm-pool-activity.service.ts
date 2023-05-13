import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { ChainID } from '../entities/pool.entity';
import { EVMIndexer } from '../../providers/evm-pocket-program/evm.indexer';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';
import {
  SyncStatusDocument,
  SyncStatusModel,
} from '../../orm/model/sync-status.model';
import { ActivityType } from '../entities/pool-activity.entity';

@Injectable()
export class SyncEvmPoolActivityService {
  constructor(
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
    @InjectModel(SyncStatusModel.name)
    private readonly syncStatusRepo: Model<SyncStatusDocument>,
  ) {}

  async syncAllPoolActivities() {
    const timer = new Timer('Sync All EVM Pools activities');
    timer.start();

    const data = await this.poolRepo.aggregate([
      {
        $match: {
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
      data.map(async ({ _id: chainId }) => {
        const syncStatus = await this.syncStatusRepo.findOne({ chainId });

        /**
         * @dev Aggregate data
         */
        const { data: events, syncedBlock } = await new EVMIndexer(
          chainId,
          this.poolRepo,
          this.whitelistRepo,
        ).fetchEventEntities(syncStatus.syncedBlock + 1, syncStatus.blockDiff);

        console.log(
          `Found ${events.length} event(s) from syncing chain ${chainId} ...`,
        );

        // @dev Bulk update data
        await this.poolActivityRepo.insertMany(events);

        /**
         * @dev Compute activities dates
         */
        const aggregatedSpecificDates = events.reduce((accum, event) => {
          if (event.type === ActivityType.CLOSED) {
            accum[event.poolId.toString()].closedAt = event.createdAt;
          }

          if (event.type === ActivityType.WITHDRAWN) {
            accum[event.poolId.toString()].endedAt = event.createdAt;
          }

          if (event.type === ActivityType.CLOSED_POSITION) {
            accum[event.poolId.toString()].closedPositionAt = event.createdAt;
          }

          return accum;
        }, {} as Record<string, { endedAt: Date; closedAt: Date; closedPositionAt: Date }>);

        /**
         * @dev Update pool dates
         */
        await this.poolRepo.bulkWrite(
          Object.keys(aggregatedSpecificDates).map((poolId) => {
            return {
              updateOne: {
                filter: { _id: new Types.ObjectId(poolId) },
                update: {
                  $set: aggregatedSpecificDates[poolId],
                },
                upsert: true,
              },
            };
          }),
        );

        // @dev Update synced block
        await this.syncStatusRepo
          .updateOne({ chainId }, { $set: { syncedBlock } })
          .exec();
      }),
    );

    timer.stop();
  }
}
