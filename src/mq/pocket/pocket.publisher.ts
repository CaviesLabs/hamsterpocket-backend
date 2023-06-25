import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Duration } from 'luxon';

import { PORTFOLIO_QUEUE } from '../dto/portfolio.queue';
import {
  BUY_APTOS_TOKEN_PROCESS,
  BUY_EVM_TOKEN_PROCESS,
  BUY_TOKEN_PROCESS,
  CLOSE_APTOS_POSITION_PROCESS,
  CLOSE_EVM_POSITION_PROCESS,
  POOL_QUEUE,
  SYNC_APTOS_POCKETS,
  SYNC_EVM_POCKETS,
  SYNC_POCKETS,
} from '../dto/pool.queue';

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
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );
    this.createSyncEVMPocketJob().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );
    this.createSyncAptosPocketJob().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );

    /**
     * @dev Bootstrapping execute swap job
     */
    this.createExecuteSwapJobs().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );

    // evm
    this.createExecuteEVMSwapJobs().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );
    this.createClosingEVMPositionJobs().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );

    // aptos
    this.createExecuteAptosSwapJobs().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );
    this.createClosingAptosPositionJobs().catch((e) =>
      console.log('ERROR::FAILED_TO_ADD_JOB', e),
    );
  }

  async createExecuteAptosSwapJobs() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(BUY_APTOS_TOKEN_PROCESS);

    /** Publish repeatable job */
    await this.pocketQueue.add(
      BUY_APTOS_TOKEN_PROCESS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: BUY_APTOS_TOKEN_PROCESS,
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

    console.log(`[${BUY_APTOS_TOKEN_PROCESS}] Added execute swap jobs ...`);
  }

  async createClosingAptosPositionJobs() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(CLOSE_APTOS_POSITION_PROCESS);

    /** Publish repeatable job */
    await this.pocketQueue.add(
      CLOSE_APTOS_POSITION_PROCESS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: CLOSE_APTOS_POSITION_PROCESS,
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

    console.log(
      `[${CLOSE_APTOS_POSITION_PROCESS}] Added execute swap jobs ...`,
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

  async createExecuteEVMSwapJobs() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(BUY_EVM_TOKEN_PROCESS);

    /** Publish repeatable job */
    await this.pocketQueue.add(
      BUY_EVM_TOKEN_PROCESS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: BUY_EVM_TOKEN_PROCESS,
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

    console.log(`[${BUY_EVM_TOKEN_PROCESS}] Added execute swap jobs ...`);
  }

  async createClosingEVMPositionJobs() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(CLOSE_EVM_POSITION_PROCESS);

    /** Publish repeatable job */
    await this.pocketQueue.add(
      CLOSE_EVM_POSITION_PROCESS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: CLOSE_EVM_POSITION_PROCESS,
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

    console.log(`[${CLOSE_EVM_POSITION_PROCESS}] Added execute swap jobs ...`);
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

  async createSyncEVMPocketJob() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(SYNC_EVM_POCKETS);

    /**
     * @dev Add a task to the queue
     */
    await this.pocketQueue.add(
      SYNC_EVM_POCKETS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: SYNC_EVM_POCKETS,
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
    console.log(`[${SYNC_EVM_POCKETS}] Added sync pocket job ...`);
  }

  async createSyncAptosPocketJob() {
    /**
     * @dev Flush the queue
     */
    await this.pocketQueue.removeRepeatableByKey(SYNC_APTOS_POCKETS);

    /**
     * @dev Add a task to the queue
     */
    await this.pocketQueue.add(
      SYNC_APTOS_POCKETS,
      {},
      {
        /** Use pool ID as jobId to upsert queue event */
        jobId: SYNC_APTOS_POCKETS,
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
    console.log(`[${SYNC_APTOS_POCKETS}] Added sync pocket job ...`);
  }
}
