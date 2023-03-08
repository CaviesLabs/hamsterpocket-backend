import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Duration } from 'luxon';

import { PORTFOLIO_QUEUE } from '../dto/portfolio.queue';
import { BUY_TOKEN_PROCESS, POOL_QUEUE, SYNC_POCKETS } from '../dto/pool.queue';

@Injectable()
export class PocketPublisher implements OnApplicationBootstrap {
  constructor(
    @InjectQueue(PORTFOLIO_QUEUE)
    private readonly portfolioQueue: Queue,
    @InjectQueue(POOL_QUEUE)
    private readonly pocketQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    /**
     * @dev Create jobs when bootstrapping application
     */
    this.createSyncPocketJob().catch((e) =>
      console.log('ERROR::FAILED_TO_SYNC_POCKET', e),
    );

    this.createExecuteSwapJobs().catch((e) =>
      console.log('ERROR::FAILED_TO_EXECUTE_SWAP', e),
    );
  }

  async createExecuteSwapJobs() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(BUY_TOKEN_PROCESS);

    /** Publish repeatable job */
    await this.pocketQueue.add(
      BUY_TOKEN_PROCESS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: BUY_TOKEN_PROCESS,
        priority: 1,

        /**
         * @dev Repeat every minute
         */
        repeat: {
          startDate: new Date(),
          every: Duration.fromObject({
            minutes: 1,
          }).toMillis(),
        },
      },
    );

    console.log(`[${BUY_TOKEN_PROCESS}] Added execute swap jobs ...`);
  }

  async createSyncPocketJob() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(SYNC_POCKETS);

    /**
     * @dev Add a task to the queue
     */
    await this.pocketQueue.add(
      SYNC_POCKETS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: SYNC_POCKETS,
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
    console.log(`[${SYNC_POCKETS}] Added sync pocket job ...`);
  }
}
