import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import {
  OcEventName,
  OcPocketEvent,
  PocketEventDeposited,
  PocketEventWithdrawn,
  // PocketEventPocketWithdrawn,
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
  DidSwap: ActivityType.SWAPPED,
  PocketWithdrawn: ActivityType.WITHDRAWN,
  VaultCreated: ActivityType.VAULT_CREATED,
  PocketConfigUpdated: ActivityType.POCKET_CONFIG_UPDATED,
};

export function convertToPoolActivityEntity(
  poolId: string,
  transactionId: string,
  eventName: OcEventName,
  data: OcPocketEvent,
  createdAt: Date,
): PoolActivityEntity {
  const activity: Partial<PoolActivityEntity> = {
    poolId: new Types.ObjectId(poolId),
    status: PoolActivityStatus.SUCCESSFUL,
    type: eventNameTypeMap[eventName],
    transactionId,
    createdAt,
  };
  switch (eventName) {
    /** Unload for these cases */
    case 'PocketCreated':
    case 'PocketUpdated':
    case 'PocketConfigUpdated':
    case 'VaultCreated':
      break;
    case 'PocketDeposited':
      activity.baseTokenAmount = (
        data as PocketEventDeposited
      ).amount.toNumber();
      break;
    case 'DidSwap':
      // TODO: map baseTokenAmount + targetTokenAmount
      break;
    case 'PocketWithdrawn':
      activity.baseTokenAmount = (
        data as PocketEventWithdrawn
      ).baseTokenAmount.toNumber();
      activity.targetTokenAmount = (
        data as PocketEventWithdrawn
      ).quoteTokenAmount.toNumber();
      break;
  }

  return plainToInstance(PoolActivityEntity, activity);
}
