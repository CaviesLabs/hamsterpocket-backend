import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import { FindPoolDto, FindPoolSortOption } from '../dtos/find-pool.dto';
import { PoolEntity } from '../entities/pool.entity';

export class PoolService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async find({
    search,
    limit,
    offset,
    ownerAddress,
    sortBy,
  }: CommonQueryDto & FindPoolDto): Promise<PoolEntity[]> {
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
      case FindPoolSortOption.PROGRESS_DESC:
        /** Sort progress stage */
        stages.push({
          $sort: {
            progress: sortBy === FindPoolSortOption.PROGRESS_ASC ? 1 : -1,
          },
        });
        break;
    }

    /** Paginate stage */
    stages.push({ $skip: offset }, { $limit: limit });

    return await this.poolRepo.aggregate<PoolModel>(stages);
  }

  createEmpty() {
    return this.poolRepo.create({});
  }
}
