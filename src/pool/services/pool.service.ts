import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';
import { FindPoolDto, FindPoolSortOption } from '../dtos/find-pool.dto';
import { PoolEntity } from '../entities/pool.entity';

@Injectable()
export class PoolService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async find({
    search,
    limit,
    offset,
    ownerAddress,
    sortBy,
    statuses,
  }: CommonQueryDto & FindPoolDto): Promise<PoolEntity[]> {
    const stages: PipelineStage[] = [];

    /** Filter & search stage */
    const filter: FilterQuery<PoolDocument> = { ownerAddress };

    if (statuses && statuses.length >= 0) {
      filter.status = { $in: statuses };
    }

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

  async createEmpty() {
    const [doc] = await this.poolRepo.create([{}], {
      validateBeforeSave: false,
    });

    return doc;
  }

  async executeBuyToken(poolId: string) {
    const pool = await this.poolRepo.findById(poolId);
    await this.onChainPoolProvider.executeBuyToken(poolId, pool.ownerAddress);
    const syncedPool = await this.onChainPoolProvider.fetchFromContract(poolId);
    await this.poolRepo.updateOne(
      { _id: new Types.ObjectId(poolId) },
      syncedPool,
      {
        upsert: true,
      },
    );
  }
}
