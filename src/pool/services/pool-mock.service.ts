import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Keypair } from '@solana/web3.js';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  PoolEntity,
  PoolStatus,
  PriceConditionType,
} from '../entities/pool.entity';

@Injectable()
export class PoolMockService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  private genPoolTemplate(): Partial<PoolEntity> {
    return {
      name: 'Batch',
      status: PoolStatus.ACTIVE,
      /** SOL */
      baseTokenAddress: 'So11111111111111111111111111111111111111112',
      /** BLOCK */
      targetTokenAddress: 'NFTUkR4u7wKxy9QLaX2TGvd9oZSWoMo4jqSJqdMb7Nk',
      batchVolume: 100,
      frequency: { days: 1 },
      buyCondition: {
        /** BLOCK */
        tokenAddress: 'NFTUkR4u7wKxy9QLaX2TGvd9oZSWoMo4jqSJqdMb7Nk',
        type: PriceConditionType.LT,
        value: [1],
      },
      stopConditions: {
        baseTokenReach: 1000,
        targetTokenReach: 60,
        endTime: DateTime.now().plus({ minutes: 10 }).toJSDate(),
        batchAmountReach: 10,
      },
      currentBaseToken: 0,
      remainingBaseTokenBalance: 0,
      currentTargetToken: 0,
      currentBatchAmount: 0,
    };
  }

  generate(ownerAddress: string) {
    return this.poolRepo.create({
      ...this.genPoolTemplate(),
      address: Keypair.generate().publicKey.toString(),
      ownerAddress,
    });
  }
}
