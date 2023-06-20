import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  StatisticsDocument,
  StatisticsModel,
} from '../../orm/model/statistic.model';
import { Timer } from '../../providers/utils.provider';
import { ChainID, PoolStatus } from '../../pool/entities/pool.entity';
import { ActivityType } from '../../pool/entities/pool-activity.entity';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';

export class StatisticsService {
  constructor(
    @InjectModel(StatisticsModel.name)
    private readonly statisticsRepo: Model<StatisticsDocument>,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
  ) {}

  getLatest() {
    return this.statisticsRepo.findOne({}, undefined, {
      sort: { createdAt: -1 },
    });
  }

  /**
   * @dev Calculate stats
   */
  async calculateNewStatistics() {
    const timer = new Timer('CALCULATE_STATISTIC');
    timer.start();

    let usersCount = 0;

    try {
      [{ usersCount }] = await this.poolRepo.aggregate<{
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
    } catch {}

    const poolsCount = await this.poolRepo
      .find({
        status: {
          $ne: PoolStatus.CREATED,
          $exists: true,
        },
      })
      .count();

    let totalVolume = 0;
    try {
      [{ totalVolume }] = await this.poolActivityRepo.aggregate([
        {
          $match: {
            type: {
              $in: [ActivityType.SWAPPED, ActivityType.CLOSED_POSITION],
            },
            chainId: { $ne: ChainID.Mumbai },
          },
        },
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
                  $multiply: [
                    '$baseTokenAmount',
                    {
                      $arrayElemAt: ['$baseToken_docs.estimatedValue', 0],
                    },
                  ],
                },
                {
                  $multiply: [
                    '$targetTokenAmount',
                    {
                      $arrayElemAt: ['$targetToken_docs.estimatedValue', 0],
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
