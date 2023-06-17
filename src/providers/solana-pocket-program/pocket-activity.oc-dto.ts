import { plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import {
  OcEventName,
  OcPocketEvent,
  OcPocketStatus,
  PocketEventDeposited,
  PocketEventDidSwap,
  PocketEventUpdated,
  PocketEventWithdrawn,
} from './pocket.type';
import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '../../pool/entities/pool-activity.entity';
import { PoolEntity } from '../../pool/entities/pool.entity';

const eventNameTypeMap: Record<OcEventName, ActivityType> = {
  PocketCreated: ActivityType.CREATED,
  PocketDeposited: ActivityType.DEPOSITED,
  PocketUpdated: undefined,
  DidSwap: ActivityType.SWAPPED,
  PocketWithdrawn: ActivityType.WITHDRAWN,
  VaultCreated: ActivityType.VAULT_CREATED,
  PocketConfigUpdated: ActivityType.POCKET_CONFIG_UPDATED,
};

const eventStatusTypeMap: Record<keyof OcPocketStatus, ActivityType> = {
  active: ActivityType.CONTINUE,
  closed: ActivityType.CLOSED,
  paused: ActivityType.PAUSED,
  withdrawn: ActivityType.WITHDRAWN,
};

function getUpdatedData(data: PocketEventUpdated): Partial<PoolActivityEntity> {
  const [status] = Object.keys(data.status);
  return {
    actor: data.actor.toBase58(),
    type: eventStatusTypeMap[status],
    memo: data.memo,
  };
}

function getDepositedData(
  data: PocketEventDeposited,
): Partial<PoolActivityEntity> {
  return {
    baseTokenAmount: data.amount.toNumber(),
  };
}

function getDidSwapData(data: PocketEventDidSwap): Partial<PoolActivityEntity> {
  return {
    baseTokenAmount: data.fromAmount.toNumber(),
    targetTokenAmount: data.toAmount.toNumber(),
  };
}

function getWithdrawnData(
  data: PocketEventWithdrawn,
): Partial<PoolActivityEntity> {
  return {
    baseTokenAmount: data.baseTokenAmount.toNumber(),
    targetTokenAmount: data.quoteTokenAmount.toNumber(),
  };
}

export function convertToPoolActivityEntity(
  pool: PoolEntity,
  transactionId: string,
  eventName: OcEventName,
  data: OcPocketEvent,
  createdAt: Date,
): PoolActivityEntity {
  const activity: Partial<PoolActivityEntity> = {
    poolId: new Types.ObjectId(pool.id),
    status: PoolActivityStatus.SUCCESSFUL,
    type: eventNameTypeMap[eventName],
    transactionId,
    createdAt,
    eventHash: `${transactionId}-${eventName}`,
  };

  switch (eventName) {
    /** Unload for these cases */
    case 'PocketCreated':
    case 'PocketConfigUpdated':
    case 'VaultCreated':
      break;
    case 'PocketUpdated':
      Object.assign(activity, getUpdatedData(data as PocketEventUpdated));
      break;
    case 'PocketDeposited':
      Object.assign(activity, getDepositedData(data as PocketEventDeposited));
      break;
    case 'DidSwap':
      Object.assign(activity, getDidSwapData(data as PocketEventDidSwap));
      break;
    case 'PocketWithdrawn':
      Object.assign(activity, getWithdrawnData(data as PocketEventWithdrawn));
      break;
  }

  return plainToInstance(PoolActivityEntity, activity);
}
