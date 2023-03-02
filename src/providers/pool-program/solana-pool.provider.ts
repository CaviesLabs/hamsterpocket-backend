import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

import {
  calculateProgressPercent,
  PoolEntity,
} from '../../pool/entities/pool.entity';
import { IDL, Pocket } from './pocket.idl';
import { RegistryProvider } from '../registry.provider';
import { convertToPoolEntity } from '../../pool/oc-dtos/pocket.oc-dto';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { BorshCoder, EventParser } from '@project-serum/anchor';
import { OcEventName, OcPocketEvent } from './pocket.type';

export const SOLANA_DEVNET_RPC_ENDPOINT = 'https://api.devnet.solana.com';
export const SOLANA_MAINNET_RPC_RPC_ENDPOINT =
  'https://boldest-few-field.solana-mainnet.quiknode.pro/0ffa9f9f5e9141aa33a030081b78fdfe40bfbae6/';

type EventWithTransaction = {
  eventName: OcEventName;

  eventData: OcPocketEvent;

  transaction: anchor.web3.ParsedTransaction;

  createdAt: Date;
};

@Injectable()
export class SolanaPoolProvider implements OnModuleInit {
  private cluster: 'devnet' | 'mainnet';
  private rpcEndpoint: string;
  private provider: anchor.Provider;
  private program: anchor.Program<Pocket>;
  private connection: Connection;

  constructor(private readonly registry: RegistryProvider) {}

  onModuleInit() {
    const { SOLANA_CLUSTER, POCKET_PROGRAM_ADDRESS } =
      this.registry.getConfig();

    switch (SOLANA_CLUSTER) {
      case 'devnet':
        this.rpcEndpoint = SOLANA_DEVNET_RPC_ENDPOINT;
        break;
      case 'mainnet':
        this.rpcEndpoint = SOLANA_MAINNET_RPC_RPC_ENDPOINT;
        break;
      default:
        throw new Error('RPC not supported');
    }

    this.cluster = SOLANA_CLUSTER;

    this.connection = new Connection(this.rpcEndpoint);

    const defaultKeyPair = Keypair.generate();
    const senderWallet = new NodeWallet(defaultKeyPair);
    this.provider = new anchor.AnchorProvider(this.connection, senderWallet, {
      preflightCommitment: 'confirmed',
      commitment: 'confirmed',
    });

    this.program = new anchor.Program(
      IDL,
      POCKET_PROGRAM_ADDRESS,
      this.provider,
    );
  }

  async fetchFromContract(poolId: string): Promise<PoolEntity> {
    const [pocketAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('SEED::POCKET::POCKET_SEED'),
        anchor.utils.bytes.utf8.encode(poolId),
      ],
      this.program.programId,
    );

    const pocketData = await this.program.account.pocket.fetch(pocketAccount);

    const pool = convertToPoolEntity(pocketAccount, pocketData);
    calculateProgressPercent.bind(pool)();

    return pool;
  }

  async fetchActivities(
    poolId: string,
    limit: number,
    lastTransaction?: string,
  ) {
    const [pocketAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('SEED::POCKET::POCKET_SEED'),
        anchor.utils.bytes.utf8.encode(poolId),
      ],
      this.program.programId,
    );

    const transactions =
      await this.connection.getConfirmedSignaturesForAddress2(pocketAccount, {
        until: lastTransaction,
        limit,
      });
    const parsedTransactions = await this.connection.getParsedTransactions(
      transactions.map(({ signature }) => signature),
      {
        commitment: 'confirmed',
      },
    );
    const eventParser = new EventParser(
      this.program.programId,
      new BorshCoder(this.program.idl),
    );

    const poolActivities: EventWithTransaction[] = [];

    for (const { meta, blockTime, transaction } of parsedTransactions) {
      const events = eventParser.parseLogs(meta.logMessages);
      for (const { name, data } of events) {
        poolActivities.push({
          eventName: name as OcEventName,
          eventData: data as OcPocketEvent,
          transaction,
          createdAt: new Date(blockTime),
        });
      }
    }

    return poolActivities;
  }

  async executeBuyToken(poolId: string, ownerAddress: string) {
    /** No swap for devnet, logging and skip */
    if (this.cluster == 'devnet') {
      console.log(
        `SolanaPoolProvider: devnet: Executed swap: poolId: ${poolId}, ownerAddress: ${ownerAddress}`,
      );
      return;
    }

    const [pocketAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('SEED::POCKET::POCKET_SEED'),
        anchor.utils.bytes.utf8.encode(poolId),
      ],
      this.program.programId,
    );

    await this.program.methods
      .executeSwap()
      .accounts({ signer: ownerAddress, pocket: pocketAccount })
      .rpc();
  }
}
