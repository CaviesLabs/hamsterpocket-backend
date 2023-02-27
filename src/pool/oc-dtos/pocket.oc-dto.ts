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

export function mapBuyCondition({
  condition,
  tokenAddress,
}: OcBuyCondition): BuyCondition {
  let type: PriceConditionType;
  const value: number[] = [];
  const statusKey = Object.keys(condition)[0];
  switch (statusKey) {
    case 'gT':
      type = PriceConditionType.GT;
      value.push(condition.gT.value.toNumber());
      break;
    case 'gTE':
      type = PriceConditionType.GTE;
      value.push(condition.gTE.value.toNumber());
      break;
    case 'lT':
      type = PriceConditionType.LT;
      value.push(condition.lT.value.toNumber());
      break;
    case 'lTE':
      type = PriceConditionType.LTE;
      value.push(condition.lTE.value.toNumber());
      break;
    case 'eQ':
      type = PriceConditionType.EQ;
      value.push(condition.eQ.value.toNumber());
      break;
    case 'nEQ':
      type = PriceConditionType.NEQ;
      value.push(condition.nEQ.value.toNumber());
      break;
    case 'bW':
      type = PriceConditionType.BW;
      value.push(
        condition.bW.from_value.toNumber(),
        condition.bW.to_value.toNumber(),
      );
      break;
    case 'nBW':
      type = PriceConditionType.NBW;
      value.push(
        condition.nBW.from_value.toNumber(),
        condition.nBW.to_value.toNumber(),
      );
      break;
  }
  return plainToInstance(BuyCondition, {
    tokenAddress: tokenAddress.toBase58(),
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
    targetTokenAddress: pocketData.targetTokenMintAddress.toBase58(),
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
