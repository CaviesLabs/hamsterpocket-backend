import { EVMBasedPocketProvider } from './evm.provider';
import {
  BuyCondition,
  ChainID,
  PoolEntity,
  PoolStatus,
  PriceConditionType,
  StopConditions,
  TradingStopCondition,
  TradingStopType,
} from '../../pool/entities/pool.entity';
import { Types } from './libs/contracts/PocketRegistry';
import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '../../pool/entities/pool-activity.entity';
import * as mongoose from 'mongoose';

export class EVMPocketConverter {
  public readonly provider: EVMBasedPocketProvider;

  constructor(public readonly chainId: ChainID) {
    this.provider = new EVMBasedPocketProvider(this.chainId);
  }

  /**
   * @dev Mapping buy condition
   * @param condition
   * @private
   */
  private mapBuyCondition(
    condition: Types.ValueComparisonStructOutput,
  ): BuyCondition | undefined {
    if (condition.operator === 0) {
      // unset
      return;
    }

    let type;

    switch (condition.operator) {
      case 1:
        type = PriceConditionType.GT;
        break;
      case 2:
        type = PriceConditionType.GTE;
        break;
      case 3:
        type = PriceConditionType.LT;
        break;
      case 4:
        type = PriceConditionType.LTE;
        break;
      case 5:
        type = PriceConditionType.BW;
        break;
      case 6:
        type = PriceConditionType.NBW;
        break;
      default:
        return;
    }

    return {
      value: [
        parseFloat(condition.value0.toString()),
        parseFloat(condition.value1.toString()),
      ],
      type,
    };
  }

  /**
   * @dev Mapping status
   * @param status
   * @private
   */
  private mapStatus(status: number): PoolStatus {
    switch (status) {
      case 1:
        return PoolStatus.ACTIVE;
      case 2:
        return PoolStatus.PAUSED;
      case 3:
        return PoolStatus.CLOSED;
      case 4:
        return PoolStatus.ENDED;
      default:
        return PoolStatus.ACTIVE;
    }
  }

  /**
   * @dev Mapping stop condition
   * @param stopConditions
   * @private
   */
  private mapStopCondition(
    stopConditions: Types.StopConditionStructOutput[],
  ): StopConditions {
    const stopCondition: StopConditions = {};

    stopConditions.map((cond) => {
      switch (cond.operator) {
        case 0:
          stopCondition.endTime = new Date(cond.value.toNumber() * 1000);
          break;
        case 1:
          stopCondition.batchAmountReach = cond.value.toNumber();
          break;
        case 2:
          stopCondition.spentBaseTokenReach = parseFloat(cond.value.toString());
          break;
        case 3:
          stopCondition.receivedTargetTokenReach = parseFloat(
            cond.value.toString(),
          );
          break;
      }
    });

    return stopCondition;
  }

  /**
   * @dev Map trading stop condition
   * @param tradingStopCondition
   * @private
   */
  private mapTradingStopCondition(
    tradingStopCondition: Types.TradingStopConditionStructOutput,
  ): TradingStopCondition | undefined {
    switch (tradingStopCondition.stopType) {
      case 0:
        return;
      case 1:
        return {
          stopType: TradingStopType.Price,
          value: parseFloat(tradingStopCondition.value.toString()),
        };
      case 2:
        return {
          stopType: TradingStopType.PortfolioPercentageDiff,
          value: parseFloat(tradingStopCondition.value.toString()),
        };
      case 3:
        return {
          stopType: TradingStopType.PortfolioValueDiff,
          value: parseFloat(tradingStopCondition.value.toString()),
        };
    }
  }

  /**
   * @dev Aggregate data
   * @param payload
   * @private
   */
  private aggregateData(payload: {
    stopConditions: Types.StopConditionStructOutput[];
    pocketData: Types.PocketStructOutput;
  }): Partial<PoolEntity> | null {
    const { pocketData, stopConditions: stopConditionData } = payload;

    if (pocketData.id === '') return null;

    return {
      id: pocketData.id,
      chainId: this.chainId,
      address: pocketData.id,
      baseTokenAddress: pocketData.baseTokenAddress,
      targetTokenAddress: pocketData.targetTokenAddress,
      batchVolume: parseFloat(pocketData.batchVolume.toString()),
      buyCondition: this.mapBuyCondition(pocketData.openingPositionCondition),
      currentBatchAmount: parseFloat(pocketData.executedBatchAmount.toString()),
      currentReceivedTargetToken: parseFloat(
        pocketData.totalReceivedTargetAmount.toString(),
      ),
      currentSpentBaseToken: parseFloat(
        pocketData.totalSwappedBaseAmount.toString(),
      ),
      currentTargetTokenBalance: parseFloat(
        pocketData.targetTokenBalance.toString(),
      ),
      depositedAmount: parseFloat(
        pocketData.totalDepositedBaseAmount.toString(),
      ),
      remainingBaseTokenBalance: parseFloat(
        pocketData.baseTokenBalance.toString(),
      ),
      frequency: {
        seconds: parseFloat(pocketData.frequency.toString()),
      },
      nextExecutionAt: new Date(
        pocketData.nextScheduledExecutionAt.toNumber() * 1000,
      ),
      ownerAddress: pocketData.owner,
      startTime: new Date(pocketData.startAt.toNumber() * 1000),
      status: this.mapStatus(pocketData.status),
      stopConditions: this.mapStopCondition(stopConditionData),
      stopLossCondition: this.mapTradingStopCondition(
        pocketData.stopLossCondition,
      ),
      takeProfitCondition: this.mapTradingStopCondition(
        pocketData.takeProfitCondition,
      ),
      totalClosedPositionInTargetTokenAmount: parseFloat(
        pocketData.totalClosedPositionInTargetTokenAmount.toString(),
      ),
      totalReceivedFundInBaseTokenAmount: parseFloat(
        pocketData.totalReceivedFundInBaseTokenAmount.toString(),
      ),
    };
  }

  /**
   * @dev Fetch single pocket entity
   * @param pocketId
   */
  public async fetchPocketEntity(
    pocketId: string,
  ): Promise<Partial<PoolEntity | null>> {
    const { stopConditions, pocketData } = await this.provider.fetchPocket(
      pocketId,
    );
    return this.aggregateData({ stopConditions, pocketData });
  }

  /**
   * @dev Fetch multiple pocket entities
   * @param pocketIdList
   */
  public async fetchMultiplePockets(
    pocketIdList: string[],
  ): Promise<Partial<PoolEntity | null>[]> {
    const onChainData = await this.provider.fetchMultiplePockets(pocketIdList);
    return onChainData.map((data) => this.aggregateData(data));
  }
  //
  // private convertPocketActivityEntity(data: any) {
  //   const eventName = data.name;
  //   const eventData = data.args;
  // }

  /**
   * @dev Fetch event entities
   * @param blockNumber
   */
  public async fetchEventEntities(
    blockNumber: number,
  ): Promise<PoolActivityEntity[]> {
    const {
      data,
      //nextBlock
    } = await this.provider.fetchEvents(blockNumber);

    return data.map((event) => {
      // const eventLogData = event.args;
      // const eventType = event.name;

      return {
        poolId: new mongoose.Types.ObjectId(event.args.pocketId as string),
        chainId: this.chainId,
        actor: event.args.actor as string,
        status: PoolActivityStatus.SUCCESSFUL,
        createdAt: new Date(event.timestamp),
        transactionId: event.transactionHash,

        type: ActivityType.SWAPPED,
        baseTokenAmount: 0,
        targetTokenAmount: 0,
        memo: 'string',
      } as PoolActivityEntity;
    });
  }
}
