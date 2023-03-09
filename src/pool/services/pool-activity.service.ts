import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import {
  PoolActivityModel,
  PoolActivityDocument,
} from '../../orm/model/pool-activity.model';
import { FindPoolActivityDto } from '../dtos/find-pool-activity.dto';

export class PoolActivityService {
  constructor(
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
  ) {}

  async find({
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
    /** Filter stage */
    const filter: FilterQuery<PoolActivityModel> = {
      'pool_docs.ownerAddress': ownerAddress,
    };
    if (statuses && statuses.length > 0) {
      filter.statuses = { $in: statuses };
    }
    if (!!timeFrom || !!timeTo) {
      filter.createdAt = {};
    }
    if (!!timeFrom) {
      filter.createdAt.$gt = timeFrom;
    }
    if (!!timeTo) {
      filter.createdAt.$lt = timeTo;
    }
    if (!!search) {
      filter.$text = { $search: search };
    }
    stages.push({ $match: filter });
    /** Pagination stages */
    stages.push({ $skip: offset }, { $limit: limit });
    return await this.poolActivityRepo.aggregate(stages);
  }
}
