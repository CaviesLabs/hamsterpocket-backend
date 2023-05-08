import { Types } from 'mongoose';

export enum PoolActivityStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum ActivityType {
  CREATED = 'ACTIVITY_TYPE::CREATED',
  PAUSED = 'ACTIVITY_TYPE::PAUSED',
  CONTINUE = 'ACTIVITY_TYPE::CONTINUE',
  CLOSED = 'ACTIVITY_TYPE::CLOSED',
  DEPOSITED = 'ACTIVITY_TYPE::DEPOSITED',
  WITHDRAWN = 'ACTIVITY_TYPE::WITHDRAWN',
  SWAPPED = 'ACTIVITY_TYPE::SWAPPED',
  CLOSED_POSITION = 'ACTIVITY_TYPE::CLOSED_POSITION',
  SKIPPED = 'ACTIVITY_TYPE::SKIPPED',
  /** Other events */
  VAULT_CREATED = 'ACTIVITY_TYPE::VAULT_CREATED',
  POCKET_CONFIG_UPDATED = 'ACTIVITY_TYPE::POCKET_CONFIG_UPDATED',
}

export class PoolActivityEntity {
  poolId: Types.ObjectId;
  chainId: string;
  actor?: string;
  status: PoolActivityStatus;
  type: ActivityType;
  baseTokenAmount: number;
  targetTokenAmount: number;
  transactionId: string;
  memo: string;
  createdAt: Date;
}
