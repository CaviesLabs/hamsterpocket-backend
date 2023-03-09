import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  StatisticsDocument,
  StatisticsModel,
} from '../../orm/model/statistic.model';
import { ActivityType } from '../../pool/entities/pool-activity.entity';
import { PoolStatus } from '../../pool/entities/pool.entity';

export class StatisticsService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
    @InjectModel(StatisticsModel.name)
    private readonly statisticsRepo: Model<StatisticsDocument>,
  ) {}

  getLatest() {
    return this.statisticsRepo.findOne({}, undefined, {
      sort: { createdAt: -1 },
    });
  }

  async onApplicationBootstrap() {
    await this.calculateNewStatistics();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async calculateNewStatistics() {
    const [{ usersCount }] = await this.poolRepo.aggregate<{
      usersCount: number;
    }>([
      {
        $match: { status: { $ne: PoolStatus.CREATED } },
      },
      {
        $group: { _id: { ownerAddress: '$ownerAddress' } },
      },
      {
        $group: { _id: null, usersCount: { $sum: 1 } },
      },
    ]);

    const poolsCount = await this.poolRepo.count();

    const [{ totalVolume }] = await this.poolActivityRepo.aggregate([
      { $match: { type: ActivityType.SWAPPED } },
      {
        $lookup: {
          from: 'pools',
          as: 'pool_docs',
          localField: 'poolId',
          foreignField: '_id',
        },
      },
      {
        $lookup: {
          from: 'whitelists',
          as: 'whitelists_docs',
          localField: 'pool_docs.0.baseTokenAddress',
          foreignField: 'address',
        },
      },
      {
        $project: {
          eventVolume: {
            $add: [
              {
                $divide: [
                  {
                    $multiply: [
                      '$baseTokenAmount',
                      {
                        $arrayElemAt: ['$whitelists_docs.estimatedValue', 0],
                      },
                    ],
                  },
                  {
                    $arrayElemAt: ['$whitelists_docs.decimals', 0],
                  },
                ],
              },
              {
                $divide: [
                  {
                    $multiply: [
                      '$targetTokenAmount',
                      {
                        $arrayElemAt: ['$whitelists_docs.estimatedValue', 0],
                      },
                    ],
                  },
                  {
                    $arrayElemAt: ['$whitelists_docs.decimals', 0],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$eventVolume' },
        },
      },
    ]);

    return this.statisticsRepo.create({
      users: usersCount,
      pockets: poolsCount,
      totalVolume,
    });
  }
}
