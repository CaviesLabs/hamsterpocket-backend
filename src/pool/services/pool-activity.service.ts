import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import * as mongoose from 'mongoose';

import { CommonQueryDto } from '@/api-docs/dto/common-query.dto';
import {
  PoolActivityModel,
  PoolActivityDocument,
} from '@/orm/model/pool-activity.model';
import { FindPoolActivityDto } from '../dtos/find-pool-activity.dto';
import { ActivityType } from '../entities/pool-activity.entity';
import { WhitelistDocument, WhitelistModel } from '@/orm/model/whitelist.model';
import { UtilsProvider } from '@/providers/utils.provider';

export class PoolActivityService {
  constructor(
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
  ) {}

  async find(
    {
      chainId,
      ownerAddress,
      statuses,
      timeTo,
      timeFrom,
      limit,
      offset,
      search,
    }: FindPoolActivityDto & CommonQueryDto,
    formatDecimals = false,
  ) {
    const stages: PipelineStage[] = [];

    /** Map pool stage */
    stages.push({
      $lookup: {
        from: 'pools',
        as: 'pool_docs',
        localField: 'poolId',
        foreignField: '_id',
      },
    });

    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'baseTokenInfo',
        localField: 'pool_docs.baseTokenAddress',
        foreignField: 'address',
      },
    });

    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'targetTokenInfo',
        localField: 'pool_docs.targetTokenAddress',
        foreignField: 'address',
      },
    });

    stages.push({
      $addFields: {
        poolIdString: {
          $toString: '$poolId',
        },
      },
    });

    /** Filter stage */
    const filter: FilterQuery<PoolActivityModel> = {
      'pool_docs.ownerAddress': ownerAddress,
      chainId,
    };

    filter.type = { $ne: ActivityType.VAULT_CREATED };
    if (statuses && statuses.length > 0) {
      filter.type = { ...filter.type, $in: statuses };
    }
    if (!!timeFrom || !!timeTo) {
      filter.createdAt = {};
    }
    if (!!timeFrom) {
      filter.createdAt.$gt = new Date(timeFrom);
    }
    if (!!timeTo) {
      filter.createdAt.$lt = new Date(timeTo);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');

      filter.$or = [
        {
          'pool_docs.name': {
            $regex: searchRegex,
          },
        },
        {
          poolIdString: {
            $regex: searchRegex,
          },
        },
      ];
    }

    stages.push({ $match: filter });

    /** Pagination stages */
    stages.push(
      { $skip: offset },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    );
    const result = await this.poolActivityRepo.aggregate(stages);

    if (formatDecimals) {
      return Promise.all(
        result.map(async (r) => {
          const baseTokenInfo = await this.whitelistRepo.findOne({
            address: (r as any).pool_docs[0].baseTokenAddress,
          });

          const targetTokenInfo = await this.whitelistRepo.findOne({
            address: (r as any).pool_docs[0].targetTokenAddress,
          });

          return this.getDisplayedDecimalsData(
            r,
            baseTokenInfo,
            targetTokenInfo,
          );
        }),
      );
    }

    return result;
  }

  private getDisplayedDecimalsData(
    activity: PoolActivityDocument,
    baseTokenInfo: WhitelistDocument,
    targetTokenInfo: WhitelistDocument,
  ) {
    if (activity.baseTokenAmount && baseTokenInfo) {
      (activity as any).baseTokenAmount =
        new UtilsProvider().getDisplayedDecimals(activity.baseTokenAmount);
    }

    if (activity.targetTokenAmount && targetTokenInfo) {
      (activity as any).targetTokenAmount =
        new UtilsProvider().getDisplayedDecimals(activity.targetTokenAmount);
    }

    return {
      ...activity,
    };
  }

  /**
   * @dev Get pool activities
   * @param poolId
   */
  async getPoolActivities(poolId: string) {
    return this.poolActivityRepo.find(
      {
        poolId: new mongoose.Types.ObjectId(poolId),
      },
      {},
      {
        sort: {
          createdAt: -1,
        },
      },
    );
  }
}
