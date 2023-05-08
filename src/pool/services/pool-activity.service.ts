import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import {
  PoolActivityModel,
  PoolActivityDocument,
} from '../../orm/model/pool-activity.model';
import { FindPoolActivityDto } from '../dtos/find-pool-activity.dto';
import { ActivityType } from '../entities/pool-activity.entity';

export class PoolActivityService {
  constructor(
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
  ) {}

  async find({
    chainId,
    ownerAddress,
    statuses,
    timeTo,
    timeFrom,
    limit,
    offset,
    search,
  }: FindPoolActivityDto & CommonQueryDto) {
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
    stages.push({ $skip: offset }, { $limit: limit });
    return this.poolActivityRepo.aggregate(stages);
  }
}
