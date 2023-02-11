import { DurationObjectUnits } from 'luxon';

export class PoolEntity {
  numberId: number;

  address: string;

  ownerAddress: string;

  name: string;

  startTime: Date;

  paxAmount: number;

  // seconds duration
  frequency: DurationObjectUnits;

  buyCondition: BuyCondition | undefined;

  stopConditions: StopConditions | undefined;
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

export enum ProgressionType {
  END_TIME = 'END_TIME',
  TARGET_BASE_AMOUNT = 'TARGET_BASE_AMOUNT',
  TARGET_TOKEN_AMOUNT = 'TARGET_TOKEN_AMOUNT',
  TIMES = 'TIMES',
}

export class StopConditions {
  endTime?: Date;

  baseAmount?: number;

  tokenAmount?: number;

  times?: number;

  progressionBy?: ProgressionType;
}
