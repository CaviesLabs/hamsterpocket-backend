import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TokenMetadataService } from '../../token-metadata/services/token-metadata.service';
import { PoolModel, PoolDocument } from '../../orm/model/pool.model';
import {
  UserTokenDocument,
  UserTokenModel,
} from '../../orm/model/user-token.model';
import { CurrencyData } from '../../providers/token-metadata.provider';
import { NotFoundException, NotImplementedException } from '@nestjs/common';

export class PortfolioService {
  constructor(
    private readonly tokenMetadataService: TokenMetadataService,
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

    const userToken = userTokens[0];

    /** Get token metadata */
    const tokenMetadata = await this.tokenMetadataService.getCurrency(
      userToken.tokenAddress,
    );

    /** Map token detail field */
    const { name, symbol } = tokenMetadata.metadata as CurrencyData;
    userToken.tokenName = name;
    userToken.tokenSymbol = symbol;

    /** Perform update */
    return await this.userTokenRepo.updateOne(
      { ownerAddress, tokenAddress },
      userToken,
      { upsert: true },
    );
  }

  async getByOwnerAddress(ownerAddress: string) {
    // TODO: implement service
    throw new NotImplementedException(ownerAddress);
  }
}
