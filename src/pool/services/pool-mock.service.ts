import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Keypair } from '@solana/web3.js';
import { Queue } from 'bull';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import {
  PORTFOLIO_QUEUE,
  UpdatePortfolioJobData,
  UPDATE_USER_TOKEN_PROCESS,
} from '../../mq/dto/portfolio.queue';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  calculateProgressPercent,
  MainProgressBy,
  PoolEntity,
  PoolStatus,
  PriceConditionType,
} from '../entities/pool.entity';

@Injectable()
export class PoolMockService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
    @InjectQueue(PORTFOLIO_QUEUE)
    private readonly portfolioQueue: Queue,
  ) {}

  private genPoolTemplate(): Partial<PoolEntity> {
    return {
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
      remainingBaseTokenBalance: 0,
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
    calculateProgressPercent.bind(poolData)();

    const pool = await this.poolRepo.create(poolData);

    /**
     * @dev Workaround for the first added job wont be able to access repo registry
     */
    await this.portfolioQueue.add(UPDATE_USER_TOKEN_PROCESS, {});

    /**
     * @dev From the second chance we add to the queue, the data will be processed properly
     */
    /** publish events update user-tokens */
    await this.portfolioQueue.add(UPDATE_USER_TOKEN_PROCESS, {
      ownerAddress,
    } as UpdatePortfolioJobData);

    return pool;
  }
}
