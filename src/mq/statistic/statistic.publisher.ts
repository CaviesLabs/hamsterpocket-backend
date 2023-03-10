import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PoolStatus } from '../../pool/entities/pool.entity';
import { ActivityType } from '../../pool/entities/pool-activity.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Model } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';
import {
  StatisticsDocument,
  StatisticsModel,
} from '../../orm/model/statistic.model';
import { Timer } from '../../providers/utils.provider';

@Injectable()
export class StatisticPublisher implements OnApplicationBootstrap {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
    @InjectModel(StatisticsModel.name)
    private readonly statisticsRepo: Model<StatisticsDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.calculateNewStatistics();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async calculateNewStatistics() {
    const timer = new Timer('CALCULATE_STATISTIC');
    timer.start();

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

    let totalVolume = 0;
    try {
      [{ totalVolume }] = await this.poolActivityRepo.aggregate([
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
            as: 'baseToken_docs',
            localField: 'pool_docs.0.baseTokenAddress',
            foreignField: 'address',
          },
        },
        {
          $lookup: {
            from: 'whitelists',
            as: 'targetToken_docs',
            localField: 'pool_docs.0.targetTokenAddress',
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
                          $arrayElemAt: ['$baseToken_docs.estimatedValue', 0],
                        },
                      ],
                    },
                    {
                      $pow: [
                        10,
                        {
                          $arrayElemAt: ['$baseToken_docs.decimals', 0],
                        },
                      ],
                    },
                  ],
                },
                {
                  $divide: [
                    {
                      $multiply: [
                        '$targetTokenAmount',
                        {
                          $arrayElemAt: ['$targetToken_docs.estimatedValue', 0],
                        },
                      ],
                    },
                    {
                      $pow: [
                        10,
                        {
                          $arrayElemAt: ['$targetToken_docs.decimals', 0],
                        },
                      ],
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
    } catch {}

    await this.statisticsRepo.create({
      users: usersCount,
      pockets: poolsCount,
      totalVolume,
    });
    timer.stop();
  }
}
