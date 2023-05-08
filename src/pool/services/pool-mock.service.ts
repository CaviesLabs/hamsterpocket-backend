import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Keypair } from '@solana/web3.js';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  calculateProgressPercent,
  ChainID,
  MainProgressBy,
  PoolEntity,
  PoolStatus,
  PriceConditionType,
} from '../entities/pool.entity';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';
import { PortfolioService } from '../../portfolio/services/portfolio.service';

@Injectable()
export class PoolMockService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,

    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,

    private readonly portfolioService: PortfolioService,
  ) {}

  private genPoolTemplate(): Partial<PoolEntity> {
    return {
      chainId: ChainID.Solana,
      name: 'Batch',
      status: PoolStatus.ACTIVE,
      /** SOL */
      baseTokenAddress: 'So11111111111111111111111111111111111111112',
      /** BLOCK */
      targetTokenAddress: 'NFTUkR4u7wKxy9QLaX2TGvd9oZSWoMo4jqSJqdMb7Nk',
      batchVolume: 1,
      frequency: { hours: 1 },
      buyCondition: {
        /** BLOCK */
        type: PriceConditionType.LT,
        value: [0.0000371],
      },
      stopConditions: {
        spentBaseTokenReach: 1,
        receivedTargetTokenReach: 259.965594,
        endTime: DateTime.now().plus({ minutes: 10 }).toJSDate(),
        batchAmountReach: 259,
      },
      currentSpentBaseToken: 0.61395378152,
      remainingBaseTokenBalance: 1 - 0.61395378152,
      currentReceivedTargetToken: 100,
      currentBatchAmount: 100,
      mainProgressBy: MainProgressBy.BATCH_AMOUNT,
    };
  }

  async generate(ownerAddress: string) {
    const poolData = plainToInstance(PoolEntity, {
      ...this.genPoolTemplate(),
      address: Keypair.generate().publicKey.toString(),
      ownerAddress,
    });

    /** Trigger calculate Pool progress */
    calculateProgressPercent(poolData);
    const pool = await this.poolRepo.create(poolData);

    /**
     * @dev From the second chance we add to the queue, the data will be processed properly
     */
    const whitelistTokens = [
      {
        address: 'So11111111111111111111111111111111111111112',
      },
    ];
    await Promise.all(
      whitelistTokens.map((token) =>
        this.portfolioService.updateUserToken(ownerAddress, token.address),
      ),
    );

    return pool;
  }
}
