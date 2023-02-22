import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import {
  UserTokenDocument,
  UserTokenModel,
} from '../../orm/model/user-token.model';
import { NotFoundException, NotImplementedException } from '@nestjs/common';
import {
  ListUserTokenDto,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { UserTokenEntity } from '../entities/user-token.entity';

export class PortfolioService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(UserTokenModel.name)
    private readonly userTokenRepo: Model<UserTokenDocument>,
  ) {}

  async updateUserToken(ownerAddress: string, tokenAddress: string) {
    /** Calculate token total amount of all pools, expect only 1 result */
    const userTokens = await this.poolRepo.aggregate<UserTokenModel>([
      {
        $match: { ownerAddress, tokenAddress },
      },
      {
        $group: {
          _id: {
            ownerAddress: '$ownerAddress',
            targetTokenAddress: '$targetTokenAddress',
          },
          totalTargetTokenAmount: {
            $sum: '$currentTargetToken',
          },
        },
      },
      {
        $project: {
          ownerAddress: '$_id.ownerAddress',
          tokenAddress: '$_id.targetTokenAddress',
          total: '$totalTargetTokenAmount',
        },
      },
    ]);
    if (userTokens.length == 0) {
      throw new NotFoundException('USER_TOKEN_NOT_FOUND');
    }

    /** Perform update */
    return await this.userTokenRepo.updateOne(
      { ownerAddress, tokenAddress },
      userTokens[0],
      { upsert: true },
    );
  }

  async listUserToken(
    ownerAddress: string,
    { limit, offset, search }: ListUserTokenDto & CommonQueryDto,
  ): Promise<UserTokenWithAdditionView[]> {
    const stages: PipelineStage[] = [];
    /** Filter & search stage */
    const filter: FilterQuery<UserTokenEntity> = {
      ownerAddress,
    };
    if (search) {
      filter.$text = { $search: search };
    }
    stages.push({ $match: filter });
    /** Add value and additional fields */
    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'whitelist',
        // TODO: $lookup
      },
    });
    /** Offset + limit */
    stages.push({ $skip: offset }, { $limit: limit });
    return await this.userTokenRepo.aggregate<UserTokenWithAdditionView>(
      stages,
    );
  }

  async getByOwnerAddress(ownerAddress: string) {
    // TODO: implement service
    throw new NotImplementedException(ownerAddress);
  }
}
