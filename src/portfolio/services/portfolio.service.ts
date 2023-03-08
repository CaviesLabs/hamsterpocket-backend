import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
// import { BadRequestException } from '@nestjs/common';

import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import {
  UserTokenDocument,
  UserTokenModel,
} from '../../orm/model/user-token.model';
import {
  ListUserTokenDto,
  ListUserTokenSortOption,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { UserTokenEntity } from '../entities/user-token.entity';
// import { PortfolioView, TopToken } from '../dtos/get-portfolio.dto';
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

  async syncUserPortfolio(ownerAddress: string) {
    /**
     * @dev Fetch all whitelisted tokens
     */
    const whitelistTokens = await this.whitelistRepo.find().exec();

    /**
     * @dev Update user token
     */
    await Promise.all(
      whitelistTokens.map((token) =>
        this.updateUserToken(ownerAddress, token.address),
      ),
    );
  }

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
            $sum: '$remainingBaseTokenBalance',
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
            $sum: '$currentReceivedTargetToken',
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
      console.log(
        `USER_TOKEN_NOT_FOUND: ${tokenAddress} skipped this calculation`,
      );
      return;
    }

    const userTokenSummary: UserTokenEntity = {
      ownerAddress,
      tokenAddress,
      total: (userBaseToken?.total || 0) + (userTargetToken?.total || 0),
    };

    /** Perform update */
    return this.userTokenRepo.updateOne(
      { ownerAddress, tokenAddress },
      userTokenSummary,
      { upsert: true },
    );
  }

  async listUserToken(
    ownerAddress: string,
    { limit, offset, search, sortBy }: ListUserTokenDto & CommonQueryDto,
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
        $addFields: {
          tokenName: {
            $arrayElemAt: ['$whitelist_docs.name', 0],
          },
          tokenSymbol: {
            $arrayElemAt: ['$whitelist_docs.symbol', 0],
          },
          value: {
            $multiply: [
              '$total',
              { $arrayElemAt: ['$whitelist_docs.estimatedValue', 0] },
            ],
          },
        },
      },
      /** Remove the `whitelist_docs` field */
      {
        $project: {
          whitelist_docs: 0,
        },
      },
    );
    /** Sort stage if requested */
    if (sortBy && sortBy.length > 0) {
      const sort: Record<string, 1 | -1> = {};
      for (const option of sortBy) {
        switch (option) {
          /** Sort by estimated value */
          case ListUserTokenSortOption.VALUE_ASC:
            sort['value'] = 1;
            break;
          case ListUserTokenSortOption.VALUE_DESC:
            sort['value'] = -1;
            break;
        }
      }
      stages.push({ $sort: sort });
    }
    /** Offset + limit */
    stages.push({ $skip: offset }, { $limit: limit });
    return this.userTokenRepo.aggregate<UserTokenWithAdditionView>(stages);
  }
  // TODO: split calculation that respect native decimals of every token
  // private async getPortfolioTotalEstimatedValue(
  //   ownerAddress: string,
  // ): Promise<number> {
  //   const [portfolioValue] = await this.userTokenRepo.aggregate<{
  //     totalValue: number;
  //   }>([
  //     { $match: { ownerAddress } },
  //     {
  //       $group: {
  //         _id: { tokenAddress: '$tokenAddress' },
  //         totalToken: { $sum: '$total' },
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'whitelists',
  //         as: 'whitelist_docs',
  //         localField: '_id.tokenAddress',
  //         foreignField: 'address',
  //       },
  //     },
  //     {
  //       $project: {
  //         totalTokenValue: {
  //           $multiply: [
  //             '$totalToken',
  //             { $first: '$whitelist_docs.estimatedValue' },
  //           ],
  //         },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: { ownerAddress: '$ownerAddress' },
  //         totalValue: { $sum: '$totalTokenValue' },
  //       },
  //     },
  //   ]);
  //   /** In new created account, portfolioValue is undefined */
  //   return portfolioValue?.totalValue || 0;
  // }
  //
  // async getBalance(
  //   ownerAddress: string,
  //   baseTokenAddress: string,
  // ): Promise<PortfolioView> {
  //   /** Fetch the price */
  //   const tokenData = await this.whitelistRepo.findOne({
  //     address: baseTokenAddress,
  //   });
  //   if (!tokenData) {
  //     throw new BadRequestException('UNSUPPORTED_TOKEN');
  //   }
  //
  //   /** Get the portfolio total value */
  //   const totalValue = await this.getPortfolioTotalEstimatedValue(ownerAddress);
  //
  //   /** Query top tokens if exists */
  //   let topTokens: TopToken[] = [];
  //   if (totalValue != 0) {
  //     topTokens = await this.userTokenRepo.aggregate<TopToken>([
  //       { $match: { ownerAddress } },
  //       {
  //         $lookup: {
  //           from: 'whitelists',
  //           as: 'whitelist_docs',
  //           localField: 'tokenAddress',
  //           foreignField: 'address',
  //         },
  //       },
  //       {
  //         $project: {
  //           symbol: { $first: '$whitelist_docs.symbol' },
  //           total: '$total',
  //           price: { $first: '$whitelist_docs.estimatedValue' },
  //           percent: {
  //             $divide: [
  //               {
  //                 $multiply: [
  //                   '$total',
  //                   { $first: '$whitelist_docs.estimatedValue' },
  //                 ],
  //               },
  //               totalValue,
  //             ],
  //           },
  //         },
  //       },
  //       {
  //         $project: { whitelist_docs: 0 },
  //       },
  //       { $sort: { percent: -1 } },
  //       { $limit: 10 },
  //     ]);
  //   }
  //
  //   return {
  //     totalPoolsBalance: totalValue / tokenData.estimatedValue,
  //     totalPoolsBalanceValue: totalValue,
  //     topTokens,
  //   };
  // }
}
