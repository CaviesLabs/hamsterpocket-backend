import { Type } from 'class-transformer';
import { DurationObjectUnits } from 'luxon';

export enum PoolStatus {
  CREATED = 'POOL_STATUS::CREATED',
  ACTIVE = 'POOL_STATUS::ACTIVE',
  PAUSED = 'POOL_STATUS::PAUSED',
  CLOSED = 'POOL_STATUS::CLOSED',
  ENDED = 'POOL_STATUS::ENDED',
}

export enum PriceConditionType {
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  /** Equal */
  EQ = 'EQ',
  /** Not Equal */
  NEQ = 'NEQ',
  /** Between */
  BW = 'BW',
  /** Not Between */
  NBW = 'NBW',
}

export enum MainProgressBy {
  END_TIME = 'MAIN_PROGRESS_BY::END_TIME',

  SPENT_BASE_TOKEN = 'MAIN_PROGRESS_BY::SPENT_BASE_TOKEN',
  RECEIVED_TARGET_TOKEN = 'MAIN_PROGRESS_BY::RECEIVED_TARGET_TOKEN',
  BATCH_AMOUNT = 'MAIN_PROGRESS_BY::BATCH_AMOUNT',
}

export class BuyCondition {
  type: PriceConditionType;

  value: number[];
}

export class StopConditions {
  endTime?: Date;

  spentBaseTokenReach?: number;

  receivedTargetTokenReach?: number;

  batchAmountReach?: number;
}

export class PoolEntity {
  id: string;

  address: string;

  ownerAddress: string;

  name: string;

  status: PoolStatus;

  baseTokenAddress: string;

  targetTokenAddress: string;

  marketKey: string;

  startTime: Date;

  nextExecutionAt: Date;

  depositedAmount: number;

  batchVolume: number;

  frequency: DurationObjectUnits;

  @Type(() => BuyCondition)
  buyCondition: BuyCondition | undefined;

  @Type(() => StopConditions)
  stopConditions: StopConditions | undefined;

  /** Progression fields */
  currentSpentBaseToken: number;

  remainingBaseTokenBalance: number;

  currentReceivedTargetToken: number;

  currentBatchAmount: number;

  mainProgressBy: MainProgressBy | undefined;

  progressPercent: number;
}

/**
 * External method because ORM model isn't need to implement.
 * Note: Require bind before call.
 */
export function calculateProgressPercent(this: PoolEntity) {
  if (!this.stopConditions) {
    this.progressPercent = -1;
    return;
  }

  switch (this.mainProgressBy) {
    case MainProgressBy.SPENT_BASE_TOKEN:
      this.progressPercent =
        this.currentSpentBaseToken / this.stopConditions.spentBaseTokenReach;
      break;

    case MainProgressBy.RECEIVED_TARGET_TOKEN:
      this.progressPercent =
        this.currentReceivedTargetToken /
        this.stopConditions.receivedTargetTokenReach;
      break;

    case MainProgressBy.BATCH_AMOUNT:
      this.progressPercent =
        this.currentBatchAmount / this.stopConditions.batchAmountReach;
      break;

    case MainProgressBy.END_TIME:
      const startTimeInMillis = this.startTime.getTime();
      const endTimeInMillis = this.stopConditions.endTime.getTime();
      const currentInMillis = new Date().getTime();
      this.progressPercent =
        (Math.min(currentInMillis, startTimeInMillis) - startTimeInMillis) /
        (endTimeInMillis - startTimeInMillis);
  }
}
