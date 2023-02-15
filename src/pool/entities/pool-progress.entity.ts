import { ObjectId } from 'mongoose';

export class PoolProgressEntity {
  poolId: ObjectId;

  currentBaseToken: number;

  currentTargetToken: number;

  currentBatchAmount: number;
}
