import { Type } from 'class-transformer';
import { DurationObjectUnits } from 'luxon';
import { ObjectId } from 'mongoose';

export enum ProgressionType {
  END_TIME = 'END_TIME',
  TARGET_BASE_AMOUNT = 'TARGET_BASE_AMOUNT',
  TARGET_TOKEN_AMOUNT = 'TARGET_TOKEN_AMOUNT',
  TIMES = 'TIMES',
}

export enum PoolStatus {
  ACTIVE = 'POOL_STATUS::ACTIVE',
  PAUSED = 'POOL_STATUS::PAUSED',
  CLOSED = 'POOL_STATUS::CLOSED',
  ENDED = 'POOL_STATUS::ENDED',
}

export enum PriceConditionType {
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  IS_BETWEEN = 'IS_BETWEEN',
  IS_NOT_BETWEEN = 'IS_NOT_BETWEEN',
}

export class BuyCondition {
  token: string;

  type: PriceConditionType;

  value: number | number[];
}

export class StopConditions {
  endTime?: Date;

  baseAmount?: number;

  tokenAmount?: number;

  times?: number;
}

export class PoolEntity {
  _id: ObjectId;

  address: string;

  ownerAddress: string;

  name: string;

  status: PoolStatus;

  pair: string[];

  startTime: Date;

  paxAmount: number;

  frequency: DurationObjectUnits;

  @Type(() => BuyCondition)
  buyCondition: BuyCondition | undefined;

  @Type(() => StopConditions)
  stopConditions: StopConditions | undefined;

  progressionBy?: ProgressionType;
}
