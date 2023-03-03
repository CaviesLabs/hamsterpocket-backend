import { PublicKey } from '@solana/web3.js';
import { plainToInstance } from 'class-transformer';
import {
  OcBuyCondition,
  OcPocket,
  OcPocketStatus,
  OcStopConditions,
} from '../../providers/pool-program/pocket.type';

import {
  BuyCondition,
  PriceConditionType,
  PoolEntity,
  PoolStatus,
  StopConditions,
  MainProgressBy,
} from '../entities/pool.entity';

export function mapPocketStatus(ocStatus: OcPocketStatus): PoolStatus {
  switch (Object.keys(ocStatus)[0]) {
    case 'active':
      return PoolStatus.ACTIVE;
    case 'closed':
      return PoolStatus.CLOSED;
    case 'paused':
      return PoolStatus.PAUSED;
    case 'withdrawn':
      return PoolStatus.ENDED;
  }
}

export function mapBuyCondition(condition: OcBuyCondition): BuyCondition {
  const value: number[] = [];
  const statusKey = Object.keys(condition)[0];
  const type = statusKey.toUpperCase() as PriceConditionType;
  switch (type) {
    case PriceConditionType.GT:
    case PriceConditionType.GTE:
    case PriceConditionType.LT:
    case PriceConditionType.LTE:
    case PriceConditionType.EQ:
    case PriceConditionType.NEQ:
      value.push(condition[statusKey].value.toNumber());
      break;
    case PriceConditionType.BW:
    case PriceConditionType.NBW:
      value.push(
        condition[statusKey].from_value.toNumber(),
        condition[statusKey].to_value.toNumber(),
      );
      break;
  }
  return plainToInstance(BuyCondition, {
    type,
    value,
  });
}

export function mapStopConditions(
  ocConditions: OcStopConditions,
): Pick<PoolEntity, 'stopConditions' | 'mainProgressBy'> {
  const stopConditions: StopConditions = {};
  let mainProgressBy: MainProgressBy;
  for (const {
    baseTokenAmountReach,
    targetTokenAmountReach,
    batchAmountReach,
    endTimeReach,
  } of ocConditions) {
    if (baseTokenAmountReach) {
      stopConditions.baseTokenReach = baseTokenAmountReach.value.toNumber();
      if (baseTokenAmountReach.is_primary) {
        mainProgressBy = MainProgressBy.BASE_TOKEN;
      }
    }
    if (targetTokenAmountReach) {
      stopConditions.targetTokenReach = targetTokenAmountReach.value.toNumber();
      if (targetTokenAmountReach.is_primary) {
        mainProgressBy = MainProgressBy.TARGET_TOKEN;
      }
    }
    if (batchAmountReach) {
      stopConditions.batchAmountReach = batchAmountReach.value.toNumber();
      if (batchAmountReach.is_primary) {
        mainProgressBy = MainProgressBy.BATCH_AMOUNT;
      }
    }
    if (endTimeReach) {
      stopConditions.endTime = new Date(endTimeReach.value.toNumber());
      if (endTimeReach.is_primary) {
        mainProgressBy = MainProgressBy.END_TIME;
      }
    }
  }
  return {
    stopConditions,
    mainProgressBy,
  };
}

export function convertToPoolEntity(
  address: PublicKey,
  pocketData: OcPocket,
): PoolEntity {
  return plainToInstance(PoolEntity, {
    id: pocketData.id,
    address: address.toBase58(),
    ownerAddress: pocketData.owner.toBase58(),
    name: pocketData.name,
    status: mapPocketStatus(pocketData.status),
    baseTokenAddress: pocketData.baseTokenMintAddress.toBase58(),
    quoteTokenAddress: pocketData.targetTokenMintAddress.toBase58(),
    startTime: new Date(pocketData.startAt.toNumber()),
    batchVolume: pocketData.batchVolume.toNumber(),
    depositedAmount: pocketData.totalDepositAmount.toNumber(),
    frequency: {
      hours: pocketData.frequency.hours.toNumber(),
    },
    buyCondition: mapBuyCondition(pocketData.buyCondition),
    ...mapStopConditions(pocketData.stopConditions),
    currentBaseToken:
      pocketData.totalDepositAmount.toNumber() -
      pocketData.baseTokenBalance.toNumber(),
    currentBatchAmount: pocketData.executedBatchAmount.toNumber(),
    currentTargetToken: pocketData.targetTokenBalance.toNumber(),
    remainingBaseTokenBalance: pocketData.baseTokenBalance.toNumber(),
  } as Partial<PoolEntity>);
}
