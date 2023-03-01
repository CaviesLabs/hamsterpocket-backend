import { Types } from 'mongoose';

export enum PoolActivityStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum ActivityType {
  CREATED = 'ACTIVITY_TYPE::CREATED',
  UPDATED = 'ACTIVITY_TYPE::UPDATED',
  DEPOSITED = 'ACTIVITY_TYPE::DEPOSITED',
  WITHDRAWN = 'ACTIVITY_TYPE::WITHDRAWN',
  SWAPPED = 'ACTIVITY_TYPE::SWAPPED',
  SKIPPED = 'ACTIVITY_TYPE::SKIPPED',
}

export class PoolActivityEntity {
  poolId: Types.ObjectId;

  status: PoolActivityStatus;

  type: ActivityType;

  baseTokenAmount: number;

  targetTokenAmount: number;

  transactionId: string;

  memo: string;

  createdAt: Date;
}
