import { AptosClient, IndexerClient, TxnBuilderTypes } from 'aptos';
import { Model, Types } from 'mongoose';

import { ChainID } from '@/pool/entities/pool.entity';
import { PoolDocument } from '@/orm/model/pool.model';
import { WhitelistDocument } from '@/orm/model/whitelist.model';
import { RegistryProvider } from '@/providers/registry.provider';
import { AptosConfig } from '@/token-metadata/entities/platform-config.entity';
import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '@/pool/entities/pool-activity.entity';
import {
  EventReason,
  UpdateClosePositionEvent,
  UpdateDepositStatsEvent,
  UpdatePocketEvent,
  UpdatePocketStatusEvent,
  UpdateTradingStatsEvent,
  UpdateWithdrawalStatsEvent,
} from '@/providers/aptos-program/library/entities/pocket-events.entity';
import { BadRequestException } from '@nestjs/common';

const { AccountAddress } = TxnBuilderTypes;

interface EventData<T> {
  account_address: string;
  creation_number: number;
  data: T;
  event_index: number;
  sequence_number: number;
  transaction_block_height: number;
  transaction_version: number;
  type: string;
}

interface QueryIndexerEventResponse<T> {
  events: EventData<T>[];
}

export class EventIndexer {
  private readonly resourceAccount: string;
  private readonly aptosIndexer: IndexerClient;
  private readonly aptosClient: AptosClient;

  constructor(
    private chainId: ChainID.AptosTestnet | ChainID.AptosMainnet,
    private readonly poolRepo: Model<PoolDocument>,
    private readonly whitelist: Model<WhitelistDocument>,
    private readonly registryProvider: RegistryProvider,
  ) {
    if (chainId !== ChainID.AptosMainnet && chainId !== ChainID.AptosTestnet) {
      throw new BadRequestException('INVALID_CHAIN_ID');
    }

    const registry = this.registryProvider.getChains()[
      this.chainId as string
    ] as AptosConfig;
    this.resourceAccount = registry.programAddress;

    // initialize aptos indexer
    this.aptosIndexer = new IndexerClient(registry.graphQLUrl);
    this.aptosClient = new AptosClient(registry.rpcUrl);
  }

  public async fetchEvents(startBlock: number, limit: number) {
    const { syncedBlock, data } = await this.getEvents(startBlock, limit);

    const memoMapping = {
      [EventReason.USER_CREATED_POCKET]: ActivityType.CREATED,
      [EventReason.USER_UPDATED_POCKET]: ActivityType.UPDATED,
      [EventReason.USER_DEPOSITED_ASSET]: ActivityType.UPDATED,
      [EventReason.USER_WITHDREW_ASSETS]: ActivityType.UPDATED,
      [EventReason.USER_PAUSED_POCKET]: ActivityType.PAUSED,
      [EventReason.USER_RESTARTED_POCKET]: ActivityType.RESTARTED,
      [EventReason.USER_CLOSED_POCKET]: ActivityType.CLOSED,
      [EventReason.OPERATOR_MADE_SWAP]: ActivityType.SWAPPED,
      [EventReason.OPERATOR_CLOSED_POCKET_DUE_TO_CONDITION_REACHED]:
        ActivityType.CLOSED,
      [EventReason.OPERATOR_CLOSED_POCKET_DUE_TO_STOP_CONDITION_REACHED]:
        ActivityType.CLOSED,
      [EventReason.USER_CLOSED_POSITION]: ActivityType.CLOSED_POSITION,
      [EventReason.OPERATOR_TOOK_PROFIT]: ActivityType.CLOSED_POSITION,
      [EventReason.OPERATOR_STOPPED_LOSS]: ActivityType.CLOSED_POSITION,
    };

    const additionalMap = {
      [EventReason.OPERATOR_TOOK_PROFIT]: ActivityType.TAKE_PROFIT,
      [EventReason.OPERATOR_STOPPED_LOSS]: ActivityType.STOP_LOSS,
    };

    const EventMap = {
      [this.eventType.UpdatePocketEvent]: async (
        event: EventData<UpdatePocketEvent>,
      ) => {
        return {
          poolId: new Types.ObjectId(event.data.id),
          chainId: this.chainId,
          eventHash: this.parseEventHash(event),
          actor: AccountAddress.fromHex(event.data.actor).toHexString(),
          status: PoolActivityStatus.SUCCESSFUL,
          type: memoMapping[event.data.reason],
          transactionId: `${event.transaction_version}`,
          memo: event.data.reason,
          createdAt: new Date(Number(event.data.timestamp) * 1000),
        } as PoolActivityEntity;
      },

      [this.eventType.UpdatePocketStatusEvent]: async (
        event: EventData<UpdatePocketStatusEvent>,
      ) => {
        return {
          poolId: new Types.ObjectId(event.data.id),
          chainId: this.chainId,
          eventHash: this.parseEventHash(event),
          actor: AccountAddress.fromHex(event.data.actor).toHexString(),
          status: PoolActivityStatus.SUCCESSFUL,
          type: memoMapping[event.data.reason],
          transactionId: `${event.transaction_version}`,
          memo: event.data.reason,
          createdAt: new Date(Number(event.data.timestamp) * 1000),
        } as PoolActivityEntity;
      },

      [this.eventType.UpdateDepositStatsEvent]: async (
        event: EventData<UpdateDepositStatsEvent>,
      ) => {
        const token = await this.whitelist.findOne({
          address: event.data.coin_type,
        });

        return {
          poolId: new Types.ObjectId(event.data.id),
          chainId: this.chainId,
          eventHash: this.parseEventHash(event),
          actor: AccountAddress.fromHex(event.data.actor).toHexString(),
          status: PoolActivityStatus.SUCCESSFUL,
          type: ActivityType.DEPOSITED,
          baseTokenAmount: parseFloat(event.data.amount) / 10 ** token.decimals,
          transactionId: `${event.transaction_version}`,
          memo: event.data.reason,
          createdAt: new Date(Number(event.data.timestamp) * 1000),
        } as PoolActivityEntity;
      },

      [this.eventType.UpdateWithdrawalStatsEvent]: async (
        event: EventData<UpdateWithdrawalStatsEvent>,
      ) => {
        const baseToken = await this.whitelist.findOne({
          address: event.data.base_coin_type,
        });
        const targetToken = await this.whitelist.findOne({
          address: event.data.target_coin_type,
        });

        return {
          poolId: new Types.ObjectId(event.data.id),
          chainId: this.chainId,
          eventHash: this.parseEventHash(event),
          actor: AccountAddress.fromHex(event.data.actor).toHexString(),
          status: PoolActivityStatus.SUCCESSFUL,
          type: ActivityType.WITHDRAWN,
          baseTokenAmount:
            parseFloat(event.data.base_coin_amount) / 10 ** baseToken.decimals,
          targetTokenAmount:
            parseFloat(event.data.target_coin_amount) /
            10 ** targetToken.decimals,
          transactionId: `${event.transaction_version}`,
          memo: event.data.reason,
          createdAt: new Date(Number(event.data.timestamp) * 1000),
        } as PoolActivityEntity;
      },

      [this.eventType.UpdateTradingStatsEvent]: async (
        event: EventData<UpdateTradingStatsEvent>,
      ) => {
        const baseToken = await this.whitelist.findOne({
          address: event.data.base_coin_type,
        });
        const targetToken = await this.whitelist.findOne({
          address: event.data.target_coin_type,
        });

        return {
          poolId: new Types.ObjectId(event.data.id),
          chainId: this.chainId,
          eventHash: this.parseEventHash(event),
          actor: AccountAddress.fromHex(event.data.actor).toHexString(),
          status: PoolActivityStatus.SUCCESSFUL,
          type: ActivityType.SWAPPED,
          baseTokenAmount:
            parseFloat(event.data.swapped_base_coin_amount) /
            10 ** baseToken.decimals,
          targetTokenAmount:
            parseFloat(event.data.received_target_coin_amount) /
            10 ** targetToken.decimals,
          transactionId: `${event.transaction_version}`,
          memo: event.data.reason,
          createdAt: new Date(Number(event.data.timestamp) * 1000),
        } as PoolActivityEntity;
      },

      [this.eventType.UpdateClosePositionEvent]: async (
        event: EventData<UpdateClosePositionEvent>,
      ) => {
        const baseToken = await this.whitelist.findOne({
          address: event.data.base_coin_type,
        });
        const targetToken = await this.whitelist.findOne({
          address: event.data.target_coin_type,
        });

        return {
          poolId: new Types.ObjectId(event.data.id),
          chainId: this.chainId,
          eventHash: this.parseEventHash(event),
          actor: AccountAddress.fromHex(event.data.actor).toHexString(),
          status: PoolActivityStatus.SUCCESSFUL,
          type: memoMapping[event.data.reason],
          baseTokenAmount:
            parseFloat(event.data.received_base_coin_amount) /
            10 ** baseToken.decimals,
          targetTokenAmount:
            parseFloat(event.data.swapped_target_coin_amount) /
            10 ** targetToken.decimals,
          transactionId: `${event.transaction_version}`,
          memo: event.data.reason,
          createdAt: new Date(Number(event.data.timestamp) * 1000),
        } as PoolActivityEntity;
      },
    };

    const events = (
      await Promise.all(
        data.map((event) => {
          return EventMap[event.type](event)
            .then((r) => r)
            .catch(() => null);
        }),
      )
    ).filter((event) => !!event);

    const additionalEvents = events
      .filter((event) => event.type === ActivityType.CLOSED_POSITION)
      .map((event) => {
        if (additionalMap[event.memo])
          return {
            ...event,
            eventHash: `${event.eventHash}-${additionalMap[event.memo]}`,
            type: additionalMap[event.memo],
            baseTokenAmount: undefined,
            targetTokenAmount: undefined,
          };

        return null;
      })
      .filter((event) => !!event);

    return {
      syncedBlock,
      data: events.concat(additionalEvents),
    };
  }

  private get eventType() {
    return {
      UpdatePocketEvent: `${this.resourceAccount}::event::UpdatePocketEvent`,
      UpdatePocketStatusEvent: `${this.resourceAccount}::event::UpdatePocketStatusEvent`,
      UpdateDepositStatsEvent: `${this.resourceAccount}::event::UpdateDepositStatsEvent`,
      UpdateWithdrawalStatsEvent: `${this.resourceAccount}::event::UpdateWithdrawalStatsEvent`,
      UpdateTradingStatsEvent: `${this.resourceAccount}::event::UpdateTradingStatsEvent`,
      UpdateClosePositionEvent: `${this.resourceAccount}::event::UpdateClosePositionEvent`,
    };
  }

  private async getEvents(startBlock: number, limit: number) {
    const currentLedgerInfo = await this.aptosClient.getLedgerInfo();

    const expectedMaxBlock = startBlock + limit;
    const desiredMaxBlock = Number(currentLedgerInfo.ledger_version);
    const newLimit =
      expectedMaxBlock > desiredMaxBlock ? desiredMaxBlock - startBlock : limit;

    const { events } = (await this.aptosIndexer.queryIndexer({
      query: `query fetchEvents($resourceAddress: String, $eventTags: [String], $limit: Int, $startFrom: bigint) {
                  events(
                    where: {account_address: {_eq: $resourceAddress}, type: {_in: $eventTags}, transaction_version: {_gte: $startFrom}}
                    limit: $limit
                    order_by: {transaction_version: desc}
                  ) {
                    account_address
                    creation_number
                    data
                    event_index
                    sequence_number
                    transaction_block_height
                    transaction_version
                    type
                  }
                }`,
      variables: {
        resourceAddress: this.resourceAccount,
        eventTags: Object.keys(this.eventType).map(
          (key) => this.eventType[key],
        ),
        limit: newLimit,
        startFrom: startBlock,
      },
    })) as QueryIndexerEventResponse<any>;

    return {
      syncedBlock: startBlock + newLimit,
      data: events,
    };
  }

  private parseEventHash(event: EventData<any>) {
    return `${event.transaction_version}-${event.creation_number}-${event.event_index}-${event.sequence_number}`;
  }
}
