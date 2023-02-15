import { ObjectId } from 'mongoose';

export enum PoolActivityStatus {
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

export enum ActivityType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  SWAP = 'SWAP',
}

export class PoolActivity {
  poolProgressId?: ObjectId;

  poolId: ObjectId;

  status: PoolActivityStatus;

  type: ActivityType;

  baseTokenAmount: number;

  targetTokenAmount: number;

  transactionId: string;
}
