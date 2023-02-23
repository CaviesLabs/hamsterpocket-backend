import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import {
  UserTokenDocument,
  UserTokenModel,
} from '../../orm/model/user-token.model';
import { NotFoundException } from '@nestjs/common';
import {
  ListUserTokenDto,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { UserTokenEntity } from '../entities/user-token.entity';
import { PortfolioView, TopToken } from '../dtos/get-portfolio.dto';

export class PortfolioService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(UserTokenModel.name)
    private readonly userTokenRepo: Model<UserTokenDocument>,
  ) {}

  async updateUserToken(ownerAddress: string, targetTokenAddress: string) {
    /** Calculate token total amount of all pools, expect only 1 result */
    const userTokens = await this.poolRepo.aggregate<UserTokenModel>([
      {
        $match: { ownerAddress, targetTokenAddress },
      },
      {
        $group: {
          _id: {
            ownerAddress: '$ownerAddress',
            targetTokenAddress: '$targetTokenAddress',
          },
          total: {
            $sum: '$currentTargetToken',
          },
        },
      },
      {
        $project: {
          ownerAddress: '$_id.ownerAddress',
          tokenAddress: '$_id.targetTokenAddress',
        },
      },
      { $project: { _id: 0 } },
    ]);

    if (userTokens.length == 0) {
      throw new NotFoundException('USER_TOKEN_NOT_FOUND');
    }

    /** Perform update */
    return await this.userTokenRepo.updateOne(
      { ownerAddress, tokenAddress: targetTokenAddress },
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
    stages.push(
      /** Merge tables */
      {
        $lookup: {
          from: 'whitelists',
          as: 'whitelist_docs',
          localField: 'tokenAddress',
          foreignField: 'address',
        },
      },
      /** Add tokenName, tokenSymbol, calculate value */
      {
        $project: {
          whitelist_docs: 0,
          tokenName: '$whitelist_docs[0].name',
          tokenSymbol: '$whitelist_docs[0].symbol',
          value: {
            $multiply: [
              '$total',
              { $arrayElemAt: ['$whitelist_docs.estimatedValue', 0] },
            ],
          },
        },
      },
    );
    /** Offset + limit */
    stages.push({ $skip: offset }, { $limit: limit });
    return await this.userTokenRepo.aggregate<UserTokenWithAdditionView>(
      stages,
    );
  }

  async getBalance(ownerAddress: string, baseTokenAddress: string) {
    const portfolios = await this.poolRepo.aggregate<PortfolioView>([
      { $match: { ownerAddress, baseTokenAddress } },
      {
        $group: {
          _id: {
            ownerAddress: '$ownerAddress',
            baseTokenAddress: '$baseTokenAddress',
          },
          totalPoolsBalance: { $sum: '$remainingBaseTokenBalance' },
        },
      },
      {
        $lookup: {
          from: 'whitelists',
          as: 'whitelist_docs',
          localField: '_id.baseTokenAddress',
          foreignField: 'address',
        },
      },
      {
        $project: {
          whitelist_docs: 1,
          totalPoolsBalance: 1,
          totalPoolsBalanceValue: {
            $multiply: [
              '$totalPoolsBalance',
              { $arrayElemAt: ['$whitelist_docs.estimatedValue', 0] },
            ],
          },
        },
      },
      {
        $project: { _id: 0, whitelist_docs: 0 },
      },
    ]);

    const portfolio = portfolios[0];

    portfolio.topTokens = await this.userTokenRepo.aggregate<TopToken>([
      { $match: { ownerAddress } },
      {
        $lookup: {
          from: 'whitelists',
          as: 'whitelist_docs',
          localField: 'tokenAddress',
          foreignField: 'address',
        },
      },
      // TODO: fix $lookup no data
      {
        $project: {
          symbol: '$whitelist_docs[0].symbol',
          percent: {
            $divide: [
              {
                $multiply: [
                  '$total',
                  { $arrayElemAt: ['$whitelist_docs.estimatedValue', 0] },
                ],
              },
              portfolio.totalPoolsBalanceValue,
            ],
          },
        },
      },
      {
        $project: { whitelist_docs: 0 },
      },
      { $sort: { percent: -1 } },
      { $limit: 10 },
    ]);

    console.log('getBalance:portfolio', portfolio);

    return portfolio;
  }
}
