import { HexString, IndexerClient } from 'aptos';
import { BigNumber } from 'ethers';
import { Model } from 'mongoose';

import {
  BuyCondition,
  ChainID,
  PoolEntity,
  PoolStatus,
  PriceConditionType,
  StopConditions,
  TradingStopCondition,
  TradingStopType,
} from '@/pool/entities/pool.entity';
import { TransactionBuilder } from '@/providers/aptos-program/library/transaction.builder';
import { TransactionSigner } from '@/providers/aptos-program/library/transaction.client';
import {
  AutoCloseConditionClosedWith,
  OpenPositionOperator,
  PocketEntity,
  PocketStatus,
  StopConditionStoppedWith,
  transformPocketEntity,
} from '@/providers/aptos-program/library/entities/pocket.entity';
import { PoolDocument } from '@/orm/model/pool.model';
import { WhitelistDocument } from '@/orm/model/whitelist.model';
import { RegistryProvider } from '@/providers/registry.provider';
import { AptosConfig } from '@/token-metadata/entities/platform-config.entity';

export class PocketIndexer {
  private readonly resourceAccount: string;
  private readonly aptosTxBuilder: TransactionBuilder;
  private readonly aptosIndexer: IndexerClient;

  constructor(
    private chainId: ChainID.AptosTestnet | ChainID.AptosMainnet,
    private readonly poolRepo: Model<PoolDocument>,
    private readonly whitelist: Model<WhitelistDocument>,
    private readonly registryProvider: RegistryProvider,
  ) {
    const registry = this.registryProvider.getChains()[
      this.chainId as string
    ] as AptosConfig;
    this.resourceAccount = registry.programAddress;

    // initialize builder
    this.aptosTxBuilder = new TransactionBuilder(
      new TransactionSigner(
        HexString.ensure(
          this.registryProvider.getConfig().NETWORKS[this.chainId as string]
            .OPERATOR_SECRET_KEY,
        ).toString(),
        this.registryProvider.getConfig().NETWORKS[
          this.chainId as string
        ].INTERNAL_RPC_URL,
      ),
      this.resourceAccount,
    );

    // initialize aptos indexer
    this.aptosIndexer = new IndexerClient(registry.graphQLUrl);
  }

  private async fetchSinglePocket(pocketId: string) {
    try {
      const [pocket] = await this.aptosTxBuilder
        .buildGetPocket({
          id: pocketId,
        })
        .execute();
      return pocket;
    } catch {
      return null;
    }
  }

  /**
   * @dev Fetch multiple pockets and parse them into valid data
   * @param pocketIdList
   */
  public async fetchPockets(
    pocketIdList: string[],
  ): Promise<Partial<PoolEntity>[]> {
    const pockets = (
      await Promise.all(pocketIdList.map((id) => this.fetchSinglePocket(id)))
    ).filter((pocket) => !!pocket);

    return Promise.all(
      pockets
        .map((pocket) => transformPocketEntity(pocket))
        .map((pocket) => this.parsePocketData(pocket)),
    );
  }

  /**
   * @dev Calculate ROI and avg price with given pocket model.
   * We will calculate and compare the balance based on the scenario that if we close position at market price, how much we get back in fund.
   * @param pocketId
   */
  public async calculateSingleROIAndAvgPrice(pocketId: string): Promise<{
    avgPrice: number;
    currentROI: number;
    currentROIValue: number;
    realizedROI: number;
    realizedROIValue: number;
  }> {
    const pocket = await this.poolRepo.findById(pocketId);
    const amount = BigNumber.from(
      `0x${(pocket.currentReceivedTargetToken || 0).toString(16)}`,
    );

    const [amountOut] = await this.aptosTxBuilder
      .buildGetQuote({
        amountIn: amount.toBigInt(),
        baseCoinType: pocket.targetTokenAddress,
        targetCoinType: pocket.baseTokenAddress,
      })
      .execute()
      .catch(() => {
        return [
          BigNumber.from(
            `0x${(pocket.currentSpentBaseToken || 0).toString(16)}`,
          )
            .toNumber()
            .toString(),
        ];
      });

    return this.calculateROIAndAvgPrice(pocket.id, BigNumber.from(amountOut));
  }

  private parsePocketData(pocketData: PocketEntity): Partial<PoolEntity> {
    const data = {
      // direct convertible map
      id: pocketData.id,
      chainId: this.chainId,
      address: pocketData.id,
      baseTokenAddress: pocketData.base_coin_type,
      targetTokenAddress: pocketData.target_coin_type,
      batchVolume: parseFloat(pocketData.batch_volume.toString()),
      frequency: {
        seconds: parseFloat(pocketData.frequency.toString()),
      },
      nextExecutionAt: new Date(
        Number(pocketData.next_scheduled_execution_at) * 1000,
      ),
      ammRouterAddress: pocketData.amm.toString(),
      ammRouterVersion: 'V2',
      ownerAddress: pocketData.owner,
      startTime: new Date(Number(pocketData.start_at) * 1000),
      remainingBaseTokenBalance: parseFloat(
        pocketData.base_coin_balance.toString(),
      ),
      currentTargetTokenBalance: parseFloat(
        pocketData.target_coin_balance.toString(),
      ),

      // computational fields
      status: this.mapPocketStatus(pocketData.status),
      buyCondition: this.mapBuyCondition(pocketData.open_position_condition),
      stopConditions: this.mapStopCondition(pocketData.auto_close_conditions),
      stopLossCondition: this.mapTradingStopCondition(
        pocketData.stop_loss_condition,
      ),
      takeProfitCondition: this.mapTradingStopCondition(
        pocketData.take_profit_condition,
      ),

      // statistic fields
      currentBatchAmount: parseFloat(
        pocketData.executed_batch_amount.toString(),
      ),
      currentReceivedTargetToken: parseFloat(
        pocketData.total_received_target_amount.toString(),
      ),
      currentSpentBaseToken: parseFloat(
        pocketData.total_swapped_base_amount.toString(),
      ),
      totalClosedPositionInTargetTokenAmount: parseFloat(
        pocketData.total_closed_position_in_target_amount.toString(),
      ),
      totalReceivedFundInBaseTokenAmount: parseFloat(
        pocketData.total_received_fund_in_base_amount.toString(),
      ),
      depositedAmount: parseFloat(
        pocketData.total_deposited_base_amount.toString(),
      ),
    } as Partial<PoolEntity>;

    if (
      data.status === PoolStatus.ACTIVE &&
      data.stopConditions.endTime &&
      new Date(data.stopConditions.endTime).getTime() <= new Date().getTime()
    ) {
      data.status = PoolStatus.CLOSED;
    }

    return data;
  }

  private async calculateROIAndAvgPrice(
    pocketId: string,
    positionValue: BigNumber,
  ) {
    const pocket = await this.poolRepo.findById(pocketId);
    const baseToken = await this.whitelist.findOne({
      address: pocket.baseTokenAddress,
    });
    const targetToken = await this.whitelist.findOne({
      address: pocket.targetTokenAddress,
    });

    if (!baseToken || !targetToken) {
      return {
        currentROIValue: null,
        currentROI: null,
        realizedROI: null,
        realizedROIValue: null,
        avgPrice: null,
      };
    }

    const avgPrice =
      pocket.currentSpentBaseToken /
      10 ** baseToken.decimals /
      (pocket.currentReceivedTargetToken / 10 ** targetToken.decimals);

    const roi =
      ((parseFloat(positionValue.toString()) -
        parseFloat(pocket.currentSpentBaseToken.toString())) *
        100) /
      parseFloat(pocket.currentSpentBaseToken.toString());

    const roiValue =
      (parseFloat(positionValue.toString()) -
        parseFloat(pocket.currentSpentBaseToken.toString())) /
      10 ** baseToken.decimals;

    const realizedROI =
      ((parseFloat(pocket.totalReceivedFundInBaseTokenAmount.toString()) -
        parseFloat(pocket.currentSpentBaseToken.toString())) *
        100) /
      parseFloat(pocket.currentSpentBaseToken.toString());

    const realizedROIValue =
      (parseFloat(pocket.totalReceivedFundInBaseTokenAmount.toString()) -
        parseFloat(pocket.currentSpentBaseToken.toString())) /
      10 ** baseToken.decimals;

    const result = {
      currentROIValue: isNaN(roiValue) ? null : roiValue,
      realizedROI: isNaN(realizedROI) ? null : realizedROI,
      realizedROIValue: isNaN(realizedROIValue) ? null : realizedROIValue,
      currentROI: isNaN(roi) ? null : roi,
      avgPrice: isNaN(avgPrice) ? null : avgPrice,
    };

    if (pocket.status === PoolStatus.ENDED) {
      result.currentROI = 0;
      result.currentROIValue = 0;
    }

    return result;
  }

  private mapPocketStatus(status: PocketStatus): PoolStatus {
    const mapper = {
      [PocketStatus.STATUS_ACTIVE]: PoolStatus.ACTIVE,
      [PocketStatus.STATUS_PAUSED]: PoolStatus.PAUSED,
      [PocketStatus.STATUS_CLOSED]: PoolStatus.CLOSED,
      [PocketStatus.STATUS_WITHDRAWN]: PoolStatus.ENDED,
    };

    return mapper[status];
  }

  private mapBuyCondition(condition: {
    value_x: bigint;
    value_y: bigint;
    operator: OpenPositionOperator;
  }): BuyCondition | undefined {
    if (condition.operator === OpenPositionOperator.UNSET) {
      // unset
      return;
    }

    let type;

    switch (condition.operator) {
      case OpenPositionOperator.OPERATOR_GT:
        type = PriceConditionType.GT;
        break;
      case OpenPositionOperator.OPERATOR_GTE:
        type = PriceConditionType.GTE;
        break;
      case OpenPositionOperator.OPERATOR_LT:
        type = PriceConditionType.LT;
        break;
      case OpenPositionOperator.OPERATOR_LTE:
        type = PriceConditionType.LTE;
        break;
      case OpenPositionOperator.OPERATOR_BW:
        type = PriceConditionType.BW;
        break;
      case OpenPositionOperator.OPERATOR_NBW:
        type = PriceConditionType.NBW;
        break;
      default:
        return;
    }

    return {
      value: [
        parseFloat(condition.value_x.toString()),
        parseFloat(condition.value_y.toString()),
      ],
      type,
    };
  }

  private mapStopCondition(
    stopConditions: {
      closed_with: AutoCloseConditionClosedWith;
      value: bigint;
    }[],
  ): StopConditions {
    const stopCondition: StopConditions = {};

    stopConditions.map((cond) => {
      switch (cond.closed_with) {
        case AutoCloseConditionClosedWith.CLOSED_WITH_END_TIME:
          stopCondition.endTime = new Date(Number(cond.value) * 1000);
          break;
        case AutoCloseConditionClosedWith.CLOSED_WITH_BATCH_AMOUNT:
          stopCondition.batchAmountReach = parseFloat(cond.value.toString());
          break;
        case AutoCloseConditionClosedWith.CLOSED_WITH_SPENT_BASE_AMOUNT:
          stopCondition.spentBaseTokenReach = parseFloat(cond.value.toString());
          break;
        case AutoCloseConditionClosedWith.CLOSED_WITH_RECEIVED_TARGET_AMOUNT:
          stopCondition.receivedTargetTokenReach = parseFloat(
            cond.value.toString(),
          );
          break;
      }
    });

    return stopCondition;
  }

  private mapTradingStopCondition(tradingStopCondition: {
    stopped_with: StopConditionStoppedWith;
    value: bigint;
  }): TradingStopCondition | undefined {
    switch (tradingStopCondition.stopped_with) {
      case StopConditionStoppedWith.UNSET:
        return;
      case StopConditionStoppedWith.STOPPED_WITH_PRICE:
        return {
          stopType: TradingStopType.Price,
          value: parseFloat(tradingStopCondition.value.toString()),
        };
      case StopConditionStoppedWith.STOPPED_WITH_PORTFOLIO_VALUE_DIFF:
        return {
          stopType: TradingStopType.PortfolioPercentageDiff,
          value: parseFloat(tradingStopCondition.value.toString()),
        };
      case StopConditionStoppedWith.STOPPED_WITH_PORTFOLIO_PERCENT_DIFF:
        return {
          stopType: TradingStopType.PortfolioValueDiff,
          value: parseFloat(tradingStopCondition.value.toString()),
        };
    }
  }
}
