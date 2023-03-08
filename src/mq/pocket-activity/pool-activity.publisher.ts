import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  POOL_ACTIVITY_QUEUE,
  SYNC_POOL_ACTIVITIES,
} from '../dto/pool-activity.queue';
import { Duration } from 'luxon';

@Injectable()
export class PoolActivityPublisher implements OnApplicationBootstrap {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectQueue(POOL_ACTIVITY_QUEUE)
    private readonly poolActivityQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.createSyncActivitiesJob().catch((e) =>
      console.log('ERROR::FAILED_TO_SYNC_POOL_ACTIVITY', e),
    );
  }

  async createSyncActivitiesJob() {
    /**
     * @dev Flush the queue
     */
    await this.poolActivityQueue.removeRepeatableByKey(POOL_ACTIVITY_QUEUE);

    /**
     * @dev Add a task to the queue
     */
    await this.poolActivityQueue.add(
      SYNC_POOL_ACTIVITIES,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: SYNC_POOL_ACTIVITIES,
        priority: 1,

        /**
         * @dev Sync data every 5 minutes
         */
        repeat: {
          startDate: new Date(),
          every: Duration.fromObject({
            minutes: 5,
          }).toMillis(),
        },
      },
    );

    /** Publish repeatable job */
    console.log(
      `[${SYNC_POOL_ACTIVITIES}] Added sync pocket activities job ...`,
    );
  }
}
