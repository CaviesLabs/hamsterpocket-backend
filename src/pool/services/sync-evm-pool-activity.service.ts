import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { SolanaPoolProvider } from '../../providers/solana-pocket-program/solana-pool.provider';
import { Timer } from '../../providers/utils.provider';
import {
  ActivityType,
  PoolActivityStatus,
} from '../entities/pool-activity.entity';
import { calculateProgressPercent, PoolStatus } from '../entities/pool.entity';
import { convertToPoolActivityEntity } from '../../providers/solana-pocket-program/pocket-activity.oc-dto';

@Injectable()
export class SyncEvmPoolActivityService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async syncAllPoolActivities() {
    const timer = new Timer('Sync All Pools activities');
    timer.start();

    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find(
      {
        status: {
          $in: [
            PoolStatus.ACTIVE,
            PoolStatus.PAUSED,
            PoolStatus.CLOSED,
            PoolStatus.ENDED,
          ],
        },
        updatedAt: {
          $gte: timer.startedAt.minus({ weeks: 1 }).toJSDate(),
          $lt: timer.startedAt.minus({ minutes: 5 }).toJSDate(),
        },
      },
      { _id: 1, status: 1 },
    );

    console.log(`Found ${poolIds.length} pool(s) to sync activities ...`);

    /**
     * @dev Sync all pool activities
     */
    await Promise.all(
      poolIds.map(async (pool) => {
        try {
          await this.syncPoolActivities(pool._id);
        } catch (e) {
          console.log('FAILED_TO_SYNC_POOL_ACTIVITIES:', pool._id, e.message);
        }
      }),
    );

    timer.stop();
  }

  async syncPoolActivities(poolId: string, cleanUp = false) {
    if (cleanUp) {
      await this.poolActivityRepo.deleteMany({
        poolId: new Types.ObjectId(poolId),
      });

      await this.poolRepo.updateOne(
        {
          _id: new Types.ObjectId(poolId),
        },
        {
          $set: {
            currentReceivedTargetToken: 0,
            currentSpentBaseToken: 0,
          },
        },
      );
    }

    const latest = await this.poolActivityRepo.findOne(
      {
        poolId: new Types.ObjectId(poolId),
        status: PoolActivityStatus.SUCCESSFUL,
      },
      undefined,
      {
        sort: { createdAt: -1 },
      },
    );

    const newActivities = await this.onChainPoolProvider.fetchActivities(
      poolId,
      1000,
      latest?.transactionId,
    );

    if (newActivities.length > 0) {
      console.log(
        `[syncPoolActivities] Found ${newActivities.length} emitted event(s) for pocket ${poolId}`,
      );
    }

    if (newActivities.length == 0) return;

    const pool = await this.poolRepo.findById(poolId);

    const mappedActivities = await Promise.all(
      newActivities.map(
        async ({ eventName, eventData, transaction, createdAt }) => {
          const activity = {
            ...convertToPoolActivityEntity(
              pool,
              transaction.signatures[0],
              eventName,
              eventData,
              createdAt,
            ),
            poolId: new Types.ObjectId(poolId),
          };

          try {
            /**
             * @dev Save the pool
             */
            if (activity.type === ActivityType.WITHDRAWN) {
              await this.poolRepo.updateOne(
                {
                  _id: new Types.ObjectId(poolId),
                },
                {
                  $set: {
                    endedAt: activity.createdAt,
                  },
                },
              );
            }

            if (activity.type === ActivityType.CLOSED) {
              await this.poolRepo.updateOne(
                {
                  _id: new Types.ObjectId(poolId),
                },
                {
                  $set: {
                    closedAt: activity.createdAt,
                  },
                },
              );
            }

            if (activity.type === ActivityType.SWAPPED) {
              await this.poolRepo.updateOne(
                {
                  _id: new Types.ObjectId(poolId),
                },
                {
                  $inc: {
                    currentReceivedTargetToken: activity.targetTokenAmount,
                    currentSpentBaseToken: activity.baseTokenAmount,
                  },
                },
              );
            }
          } catch (e) {
            console.log(e);
          }

          return activity;
        },
      ),
    );

    await this.poolActivityRepo.create(mappedActivities);

    // re-calcualte progress percent
    const latestPool = await this.poolRepo.findById(poolId);
    await calculateProgressPercent(latestPool);
    await latestPool.save();
  }
}
