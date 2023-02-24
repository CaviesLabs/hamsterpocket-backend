import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import {
  UserTokenDocument,
  UserTokenModel,
} from '../../orm/model/user-token.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  ListUserTokenDto,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { UserTokenEntity } from '../entities/user-token.entity';
import { PortfolioView, TopToken } from '../dtos/get-portfolio.dto';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';

export class PortfolioService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectModel(UserTokenModel.name)
    private readonly userTokenRepo: Model<UserTokenDocument>,
    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
  ) {}

  async updateUserToken(ownerAddress: string, tokenAddress: string) {
    /** Calculate base token total amount of all pools, expect only 1 ownerAddress/tokenAddress result */
    const [userBaseToken] = await this.poolRepo.aggregate<UserTokenEntity>([
      { $match: { ownerAddress, baseTokenAddress: tokenAddress } },
      {
        $group: {
          _id: {
            ownerAddress: '$ownerAddress',
            baseTokenAddress: '$baseTokenAddress',
          },
          total: {
            $sum: '$currentBaseToken',
          },
        },
      },
      {
        $project: {
          ownerAddress: '$_id.ownerAddress',
          tokenAddress: '$_id.baseTokenAddress',
          total: 1,
        },
      },
      { $project: { _id: 0 } },
    ]);

    /** Calculate target token total amount of all pools, expect only 1 ownerAddress/tokenAddress result */
    const [userTargetToken] = await this.poolRepo.aggregate<UserTokenEntity>([
      { $match: { ownerAddress, targetTokenAddress: tokenAddress } },
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
          total: 1,
        },
      },
      { $project: { _id: 0 } },
    ]);
    if (!userBaseToken && !userTargetToken) {
      throw new NotFoundException('USER_TOKEN_NOT_FOUND');
    }

    const userTokenSummary: UserTokenEntity = {
      ownerAddress,
      tokenAddress,
      total: (userBaseToken?.total || 0) + (userTargetToken?.total || 0),
    };

    /** Perform update */
    return await this.userTokenRepo.updateOne(
      { ownerAddress, tokenAddress },
      userTokenSummary,
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
          tokenName: { $first: '$whitelist_docs.name' },
          tokenSymbol: { $first: '$whitelist_docs.symbol' },
          value: {
            $multiply: ['$total', { $first: '$whitelist_docs.estimatedValue' }],
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

  private async getPortfolioTotalEstimatedValue(
    ownerAddress: string,
  ): Promise<number> {
    const portfolioValue = await this.userTokenRepo.aggregate<{
      totalValue: number;
    }>([
      { $match: { ownerAddress } },
      {
        $group: {
          _id: { tokenAddress: '$tokenAddress' },
          totalToken: { $sum: '$total' },
        },
      },
      {
        $lookup: {
          from: 'whitelists',
          as: 'whitelist_docs',
          localField: '_id.tokenAddress',
          foreignField: 'address',
        },
      },
      {
        $project: {
          totalTokenValue: {
            $multiply: [
              '$totalToken',
              { $first: '$whitelist_docs.estimatedValue' },
            ],
          },
        },
      },
      {
        $group: {
          _id: { ownerAddress: '$ownerAddress' },
          totalValue: { $sum: '$totalTokenValue' },
        },
      },
    ]);

    return portfolioValue[0].totalValue;
  }

  async getBalance(
    ownerAddress: string,
    baseTokenAddress: string,
  ): Promise<PortfolioView> {
    /** Fetch the price */
    const tokenData = await this.whitelistRepo.findOne({
      address: baseTokenAddress,
    });
    if (!tokenData) {
      throw new BadRequestException('UNSUPPORTED_TOKEN');
    }

    /** Get the portfolio total value */
    const totalValue = await this.getPortfolioTotalEstimatedValue(ownerAddress);

    /** Query top tokens if exists */
    let topTokens: TopToken[] = [];
    if (totalValue != 0) {
      topTokens = await this.userTokenRepo.aggregate<TopToken>([
        { $match: { ownerAddress } },
        {
          $lookup: {
            from: 'whitelists',
            as: 'whitelist_docs',
            localField: 'tokenAddress',
            foreignField: 'address',
          },
        },
        {
          $project: {
            symbol: { $first: '$whitelist_docs.symbol' },
            total: '$total',
            price: { $first: '$whitelist_docs.estimatedValue' },
            percent: {
              $divide: [
                {
                  $multiply: [
                    '$total',
                    { $first: '$whitelist_docs.estimatedValue' },
                  ],
                },
                totalValue,
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
    }

    return {
      totalPoolsBalance: totalValue / tokenData.estimatedValue,
      totalPoolsBalanceValue: totalValue,
      topTokens,
    };
  }
}
