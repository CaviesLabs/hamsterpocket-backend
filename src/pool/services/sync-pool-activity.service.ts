import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';
import { Timer } from '../../providers/utils.provider';
import { PoolActivityStatus } from '../entities/pool-activity.entity';
import { PoolStatus } from '../entities/pool.entity';
import { convertToPoolActivityEntity } from '../oc-dtos/pocket-activity.oc-dto';

@Injectable()
export class SyncPoolActivityService {
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

  async syncPoolActivities(poolId: string) {
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

    const mappedActivities = newActivities.map(
      ({ eventName, eventData, transaction, createdAt }) => {
        return {
          ...convertToPoolActivityEntity(
            pool,
            transaction.signatures[0],
            eventName,
            eventData,
            createdAt,
          ),
          poolId: new Types.ObjectId(poolId),
        };
      },
    );
    await this.poolActivityRepo.create(mappedActivities);
  }
}
