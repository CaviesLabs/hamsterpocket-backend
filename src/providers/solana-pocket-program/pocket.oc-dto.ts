import { PublicKey } from '@solana/web3.js';
import { plainToInstance } from 'class-transformer';
import { OcBuyCondition, OcPocket, OcStopConditions } from './pocket.type';

import {
  BuyCondition,
  PriceConditionType,
  PoolEntity,
  PoolStatus,
  StopConditions,
  MainProgressBy,
} from '../../pool/entities/pool.entity';

export function mapPocketStatus(pocketData: OcPocket): PoolStatus {
  switch (Object.keys(pocketData.status)[0]) {
    case 'active':
      const endTimeCondition = pocketData.stopConditions.find(
        (condition) => !!condition.endTimeReach,
      );
      const endDate = new Date(
        endTimeCondition?.endTimeReach.value.toNumber() * 1000 || 0,
      );

      if (endTimeCondition && endDate.getTime() <= new Date().getTime()) {
        return PoolStatus.CLOSED;
      }

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
        condition[statusKey].fromValue.toNumber(),
        condition[statusKey].toValue.toNumber(),
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
  side: 'buy' | 'sell',
): Pick<PoolEntity, 'stopConditions' | 'mainProgressBy'> {
  const stopConditions: StopConditions = {};
  let mainProgressBy: MainProgressBy;

  for (const {
    baseTokenAmountReach,
    quoteTokenAmountReach,
    spentBaseTokenAmountReach,
    spentQuoteTokenAmountReach,
    batchAmountReach,
    endTimeReach,
  } of ocConditions) {
    /**
     * @dev Map batch amount reach
     */
    if (batchAmountReach) {
      stopConditions.batchAmountReach = batchAmountReach.value.toNumber();

      if ((batchAmountReach as any).isPrimary) {
        mainProgressBy = MainProgressBy.BATCH_AMOUNT;
      }
    }

    /**
     * @dev Map end time reach
     */
    if (endTimeReach) {
      stopConditions.endTime = new Date(endTimeReach.value.toNumber() * 1000);

      if ((endTimeReach as any).isPrimary) {
        mainProgressBy = MainProgressBy.END_TIME;
      }
    }

    /**
     * @dev Map spent amount reach
     */
    const spentAmountReach =
      side === 'buy' ? spentQuoteTokenAmountReach : spentBaseTokenAmountReach;

    if (spentAmountReach) {
      stopConditions.spentBaseTokenReach = spentAmountReach.value.toNumber();

      if ((spentAmountReach as any).isPrimary) {
        mainProgressBy = MainProgressBy.SPENT_BASE_TOKEN;
      }
    }

    /**
     * @dev Map received target amount reach
     */
    const receivedTargetAmountReach =
      side === 'buy' ? baseTokenAmountReach : quoteTokenAmountReach;

    if (receivedTargetAmountReach) {
      stopConditions.receivedTargetTokenReach =
        receivedTargetAmountReach.value.toNumber();

      if ((receivedTargetAmountReach as any).isPrimary) {
        mainProgressBy = MainProgressBy.RECEIVED_TARGET_TOKEN;
      }
    }
  }
  return {
    stopConditions,
    mainProgressBy,
  };
}

const determineTradeSideData = (pocketData: OcPocket): Partial<PoolEntity> => {
  const [sideValue] = Object.keys(pocketData.side);

  switch (sideValue) {
    case 'buy':
      return {
        baseTokenAddress: pocketData.quoteTokenMintAddress.toBase58(),
        targetTokenAddress: pocketData.baseTokenMintAddress.toBase58(),
        depositedAmount: pocketData.totalQuoteDepositAmount.toNumber(),
        currentTargetTokenBalance: pocketData.baseTokenBalance.toNumber(),
        remainingBaseTokenBalance: pocketData.quoteTokenBalance.toNumber(),
        ...mapStopConditions(pocketData.stopConditions, sideValue),
      };

    case 'sell':
      return {
        baseTokenAddress: pocketData.baseTokenMintAddress.toBase58(),
        targetTokenAddress: pocketData.quoteTokenMintAddress.toBase58(),
        depositedAmount: pocketData.totalBaseDepositAmount.toNumber(),
        currentTargetTokenBalance: pocketData.quoteTokenBalance.toNumber(),
        remainingBaseTokenBalance: pocketData.baseTokenBalance.toNumber(),
        ...mapStopConditions(pocketData.stopConditions, sideValue),
      };
  }
};

export function convertToPoolEntity(
  address: PublicKey,
  pocketData: OcPocket,
): PoolEntity {
  return plainToInstance(PoolEntity, {
    ...determineTradeSideData(pocketData),
    id: pocketData.id,
    address: address.toBase58(),
    ownerAddress: pocketData.owner.toBase58(),
    name: pocketData.name,
    status: mapPocketStatus(pocketData),
    startTime: new Date(pocketData.startAt.toNumber() * 1000),
    nextExecutionAt: new Date(
      (pocketData.nextScheduledExecutionAt.toNumber() !== 0
        ? pocketData.nextScheduledExecutionAt
        : pocketData.startAt
      ).toNumber() * 1000,
    ),
    batchVolume: pocketData.batchVolume.toNumber(),
    frequency: {
      hours: pocketData.frequency.hours.toNumber(),
    },
    buyCondition: pocketData.buyCondition
      ? mapBuyCondition(pocketData.buyCondition)
      : null,
    currentBatchAmount: pocketData.executedBatchAmount.toNumber(),
    marketKey: pocketData.marketKey.toBase58(),
    // Below fields will be updated once the events data is computed
    ammRouterAddress: pocketData.marketKey.toString(),
  } as Partial<PoolEntity>);
}
