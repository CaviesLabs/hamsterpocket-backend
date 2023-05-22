import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
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
            $sum: '$currentTargetTokenBalance',
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
    {
      limit,
      offset,
      search,
      sortBy,
      chainId,
    }: ListUserTokenDto & CommonQueryDto,
  ): Promise<UserTokenWithAdditionView[]> {
    const stages: PipelineStage[] = [];

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
      {
        $match: {
          ownerAddress,
          $or: [
            {
              'whitelist_docs.name': {
                $regex: new RegExp(search, 'i'),
              },
            },
            {
              'whitelist_docs.address': {
                $regex: new RegExp(search, 'i'),
              },
            },
          ],
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
          tokenImage: {
            $arrayElemAt: ['$whitelist_docs.image', 0],
          },
          chainId: {
            $arrayElemAt: ['$whitelist_docs.chainId', 0],
          },
          decimalValue: {
            $divide: [
              '$total',
              {
                $pow: [
                  10,
                  {
                    $arrayElemAt: ['$whitelist_docs.decimals', 0],
                  },
                ],
              },
            ],
          },
          usdValue: {
            $divide: [
              {
                $multiply: [
                  '$total',
                  { $arrayElemAt: ['$whitelist_docs.estimatedValue', 0] },
                ],
              },
              {
                $pow: [
                  10,
                  {
                    $arrayElemAt: ['$whitelist_docs.decimals', 0],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $match: {
          chainId: chainId,
        },
      },
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
            sort['usdValue'] = 1;
            break;
          case ListUserTokenSortOption.VALUE_DESC:
            sort['usdValue'] = -1;
            break;
        }
      }
      stages.push({ $sort: sort });
    }
    /** Offset + limit */
    stages.push({ $skip: offset }, { $limit: limit });
    return this.userTokenRepo.aggregate<UserTokenWithAdditionView>(stages);
  }

  /**
   * @dev calculate ROI now only applies with evm pools
   */
  // public async calculateAndSnapshotPNL() {}

  async getPortfolioPNL(
    ownerAddresses: string[],
  ): Promise<{ ownerAddress: string; totalROIValueInUSD: number }[]> {
    const stages: PipelineStage[] = [];

    // @dev Find the docs that have `currentROIValue`
    stages.push({
      $match: {
        currentROIValue: {
          $exists: true,
        },
        ownerAddress:
          ownerAddresses.length > 0 ? { $in: ownerAddresses } : undefined,
      },
    });

    // @dev Join whitelist docs
    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'targetToken_docs',
        localField: 'targetTokenAddress',
        foreignField: 'address',
      },
    });
    stages.push({
      $lookup: {
        from: 'whitelists',
        as: 'baseToken_docs',
        localField: 'baseTokenAddress',
        foreignField: 'address',
      },
    });

    // @dev Filter valid records only
    stages.push({
      $match: {
        targetToken_docs: {
          $size: 1,
        },
        baseToken_docs: {
          $size: 1,
        },
      },
    });

    stages.push({
      $addFields: {
        roiValueInUSD: {
          $multiply: [
            '$currentROIValue',
            {
              $arrayElemAt: ['$baseToken_docs.estimatedValue', 0],
            },
          ],
        },
      },
    });

    stages.push({
      $group: {
        _id: '$ownerAddress',
        totalROIValueInUSD: {
          $sum: '$roiValueInUSD',
        },
        ownerAddress: {
          $first: '$ownerAddress',
        },
      },
    });

    stages.push({
      $project: {
        _id: 0,
        totalROIValueInUSD: 1,
        ownerAddress: 1,
      },
    });

    return this.poolRepo.aggregate(stages);
  }
}
