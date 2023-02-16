import { ObjectId } from 'mongoose';

export enum PoolActivityStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum ActivityType {
  DEPOSIT = 'ACTIVITY_TYPE::DEPOSIT',
  WITHDRAW = 'ACTIVITY_TYPE::WITHDRAW',
  SWAP = 'ACTIVITY_TYPE::SWAP',
  SKIPPED = 'ACTIVITY_TYPE::SKIPPED',
}

export class PoolActivityEntity {
  poolId: ObjectId;

  status: PoolActivityStatus;

  type: ActivityType;

  baseTokenAmount: number;

  targetTokenAmount: number;

  transactionId: string;

  memo: string;
}
