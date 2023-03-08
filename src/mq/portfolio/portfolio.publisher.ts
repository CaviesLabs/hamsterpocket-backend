import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Duration } from 'luxon';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  PORTFOLIO_QUEUE,
  UPDATE_USER_TOKEN_PROCESS,
  UpdatePortfolioJobData,
} from '../dto/portfolio.queue';

@Injectable()
export class PortfolioPublisher implements OnApplicationBootstrap {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectQueue(PORTFOLIO_QUEUE)
    private readonly portfolioQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    /**
     * @dev Clean up
     */
    await this.portfolioQueue.empty();

    /**
     * @dev Start new queue
     */
    console.log('Started adding queues for portfolio update ...');

    /**
     * @dev Aggregate owner address first
     */
    const ownerAddresses: { address: string }[] = await this.poolRepo
      .aggregate([
        {
          $group: {
            _id: '$ownerAddress',
            address: {
              $first: '$ownerAddress',
            },
          },
        },
        {
          $match: {
            _id: {
              $ne: null,
            },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();

    /**
     * @dev Distribute tasks for every owner, the tasks will be repeated after 5 minutes
     */
    await Promise.all(
      ownerAddresses.map(async ({ address }) => {
        await this.portfolioQueue.add(
          UPDATE_USER_TOKEN_PROCESS,
          {
            ownerAddress: address,
          } as UpdatePortfolioJobData,
          {
            // persist job id as address so that it cannot be duplicated
            jobId: address,

            // Add a repeat strategy so that we can keep portfolio update
            repeat: {
              every: Duration.fromObject({
                minutes: 1,
              }).toMillis(),
            },
          },
        );
      }),
    );
  }
}
