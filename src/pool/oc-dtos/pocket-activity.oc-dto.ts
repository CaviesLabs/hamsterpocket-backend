import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import {
  OcEventName,
  OcPocketEvent,
  PocketEventPocketWithdrawn,
} from '../../providers/pool-program/pocket.type';
import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '../entities/pool-activity.entity';

const eventNameTypeMap: Record<OcEventName, ActivityType> = {
  PocketCreated: ActivityType.CREATED,
  PocketDeposited: ActivityType.DEPOSITED,
  PocketUpdated: ActivityType.UPDATED,
  PocketWithdrawn: ActivityType.WITHDRAWN,
};

export function convertToPoolActivityEntity(
  poolId: string,
  transactionId: string,
  eventName: OcEventName,
  ocEvent: OcPocketEvent,
  createdAt: Date,
): PoolActivityEntity {
  return plainToInstance(PoolActivityEntity, {
    poolId: new Types.ObjectId(poolId),
    status: PoolActivityStatus.SUCCESSFUL,
    type: eventNameTypeMap[eventName],
    baseTokenAmount: (ocEvent as PocketEventPocketWithdrawn).baseTokenAmount,
    targetTokenAmount: (ocEvent as PocketEventPocketWithdrawn)
      .targetTokenAmount,
    transactionId,
    createdAt,
  });
}
