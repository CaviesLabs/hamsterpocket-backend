import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Keypair } from '@solana/web3.js';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  calculateProgressPercent,
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
      frequency: { hours: 1 },
      buyCondition: {
        /** BLOCK */
        tokenAddress: 'NFTUkR4u7wKxy9QLaX2TGvd9oZSWoMo4jqSJqdMb7Nk',
        type: PriceConditionType.LT,
        value: [10],
      },
      stopConditions: {
        baseTokenReach: 1000,
        targetTokenReach: 100,
        endTime: DateTime.now().plus({ minutes: 10 }).toJSDate(),
        batchAmountReach: 10,
      },
      currentBaseToken: 500,
      remainingBaseTokenBalance: 500,
      currentTargetToken: 50,
      currentBatchAmount: 10,
    };
  }

  generate(ownerAddress: string) {
    const pool = plainToInstance(PoolEntity, {
      ...this.genPoolTemplate(),
      address: Keypair.generate().publicKey.toString(),
      ownerAddress,
    });
    /** Trigger calculate Pool progress */
    calculateProgressPercent.bind(pool)();
    return this.poolRepo.create(pool);
  }
}
