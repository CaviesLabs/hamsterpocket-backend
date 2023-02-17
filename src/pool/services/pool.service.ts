import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import { FindPoolDto, FindPoolSortOption } from '../dtos/find-pool.dto';

export class PoolService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  find({
    search,
    limit,
    offset,
    ownerAddress,
    sortBy,
  }: CommonQueryDto & FindPoolDto) {
    const stages: PipelineStage[] = [];

    /** Filter & search stage */
    const filter: FilterQuery<PoolDocument> = { ownerAddress };
    if (search) {
      filter.$text = { $search: search };
    }
    stages.push({ $match: filter });

    /** Sort stage */
    switch (sortBy) {
      case FindPoolSortOption.DATE_START_DESC:
        stages.push({ $sort: { startTime: -1 } });
        break;
      case FindPoolSortOption.DATE_CREATED_DESC:
        stages.push({ $sort: { createdAt: -1 } });
        break;
      case FindPoolSortOption.PROGRESS_ASC:
        stages.push(
          /** Computing progress stage
           * if no stop condition set value to 1.1 > 1 (100%)
           * get max of 3 progresses (maximum: 1), TODO: time base
           */
          {
            $project: {
              progress: {
                $cond: {
                  if: { $eq: ['$stopConditions', null] },
                  then: 1.1,
                  else: {
                    $min: [
                      {
                        $cond: {
                          if: {
                            $neq: ['$stopConditions.baseTokenReach', null],
                          },
                          then: 1.1,
                          else: {
                            $divide: [
                              '$currentBaseToken',
                              '$stopConditions.baseTokenReach',
                            ],
                          },
                        },
                      },
                      {
                        $cond: {
                          if: {
                            $neq: ['$stopConditions.targetTokenReach', null],
                          },
                          then: 1.1,
                          else: {
                            $divide: [
                              '$currentTargetToken',
                              '$stopConditions.targetTokenReach',
                            ],
                          },
                        },
                      },
                      {
                        $cond: {
                          if: {
                            $neq: ['$stopConditions.batchAmountReach', null],
                          },
                          then: 1.1,
                          else: {
                            $divide: [
                              '$currentBatchAmount',
                              '$stopConditions.batchAmountReach',
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        );
      case FindPoolSortOption.PROGRESS_DESC:
        stages.push(
          /** Computing progress stage
           * if no stop condition set value to -0.1 < 1 (100%)
           * get min of 3 progresses (minimum: 0.0), TODO: time base
           */
          {
            $project: {
              progress: {
                $cond: {
                  if: { $eq: ['$stopConditions', null] },
                  then: -0.1,
                  else: {
                    $max: [
                      {
                        $cond: {
                          if: {
                            $neq: ['$stopConditions.baseTokenReach', null],
                          },
                          then: -0.1,
                          else: {
                            $divide: [
                              '$currentBaseToken',
                              '$stopConditions.baseTokenReach',
                            ],
                          },
                        },
                      },
                      {
                        $cond: {
                          if: {
                            $neq: ['$stopConditions.targetTokenReach', null],
                          },
                          then: -0.1,
                          else: {
                            $divide: [
                              '$currentTargetToken',
                              '$stopConditions.targetTokenReach',
                            ],
                          },
                        },
                      },
                      {
                        $cond: {
                          if: {
                            $neq: ['$stopConditions.batchAmountReach', null],
                          },
                          then: -0.1,
                          else: {
                            $divide: [
                              '$currentBatchAmount',
                              '$stopConditions.batchAmountReach',
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        );
      case (FindPoolSortOption.PROGRESS_ASC, FindPoolSortOption.PROGRESS_DESC):
        /** Sort progress stage */
        stages.push({ $sort: { progress: 1 } });
        break;
    }

    /** Paginate stage */
    stages.push({ $skip: offset }, { $limit: limit });

    return this.poolRepo.aggregate<PoolDocument>(stages);
  }

  createEmpty() {
    return this.poolRepo.create({});
  }
}
