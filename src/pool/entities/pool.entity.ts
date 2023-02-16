import { Type } from 'class-transformer';
import { DurationObjectUnits } from 'luxon';
import { ObjectId } from 'mongoose';

export enum PoolStatus {
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

export class BuyCondition {
  tokenAddress: string;

  type: PriceConditionType;

  value: number[];
}

export class StopConditions {
  endTime?: Date;

  baseTokenReach?: number;

  targetTokenReach?: number;

  batchAmountReach?: number;
}

export class PoolEntity {
  _id: ObjectId;

  address: string;

  ownerAddress: string;

  name: string;

  status: PoolStatus;

  baseTokenAddress: string;

  targetTokenAddress: string;

  startTime: Date;

  depositedAmount: number;

  batchVolume: number;

  frequency: DurationObjectUnits;

  @Type(() => BuyCondition)
  buyCondition: BuyCondition | undefined;

  @Type(() => StopConditions)
  stopConditions: StopConditions | undefined;

  /** Progression fields */
  currentBaseToken: number;

  remainingBaseTokenBalance: number;

  currentTargetToken: number;

  currentBatchAmount: number;
}
