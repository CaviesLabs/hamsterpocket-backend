import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { BorshCoder, EventParser } from '@project-serum/anchor';
import { OpenOrders } from '@openbook-dex/openbook';
import * as bs from 'bs58';

import { PoolEntity } from '../../pool/entities/pool.entity';
import { IDL, Pocket } from './pocket.idl';
import { RegistryProvider } from '../registry.provider';
import { convertToPoolEntity } from './pocket.oc-dto';

import { OcEventName, OcPocketEvent } from './pocket.type';
import { ProgramAccountsProvider } from './program-accounts.provider';

type EventWithTransaction = {
  eventName: OcEventName;
  eventData: OcPocketEvent;
  transaction: anchor.web3.ParsedTransaction;
  createdAt: Date;
};

@Injectable()
export class SolanaPoolProvider implements OnModuleInit {
  private rpcEndpoint: string;
  private provider: anchor.AnchorProvider;
  private program: anchor.Program<Pocket>;
  private connection: Connection;

  constructor(private readonly registry: RegistryProvider) {}

  onModuleInit() {
    const {
      POCKET_PROGRAM_ADDRESS,
      OPERATOR_SECRET_KEY,
      INTERNAL_RPC_URL: RPC_URL,
    } = this.registry.getConfig().NETWORKS['solana'];

    const defaultKeyPair = Keypair.fromSecretKey(
      Uint8Array.from(bs.decode(OPERATOR_SECRET_KEY)),
    );
    const senderWallet = new NodeWallet(defaultKeyPair);

    this.rpcEndpoint = RPC_URL;
    this.connection = new Connection(this.rpcEndpoint);

    this.provider = new anchor.AnchorProvider(this.connection, senderWallet, {
      preflightCommitment: 'processed',
      commitment: 'processed',
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
        anchor.utils.bytes.utf8.encode(poolId.toString()),
      ],
      this.program.programId,
    );

    const pocketData = await this.program.account.pocket.fetch(pocketAccount);

    return convertToPoolEntity(pocketAccount, pocketData);
  }

  async fetchActivities(
    poolId: string,
    limit: number,
    lastTransaction?: string,
  ) {
    try {
      const [pocketAccount] = PublicKey.findProgramAddressSync(
        [
          anchor.utils.bytes.utf8.encode('SEED::POCKET::POCKET_SEED'),
          anchor.utils.bytes.utf8.encode(poolId.toString()),
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
            createdAt: new Date(blockTime * 1000),
          });
        }
      }

      return poolActivities;
    } catch {
      return [];
    }
  }

  public async executeSwapToken(opt: {
    pocketId: string;
    baseMint: string;
    quoteMint: string;
    marketKey: string;
    marketProgramId: string;
    marketAuthority;
  }) {
    const fixtures = await new ProgramAccountsProvider(
      this.provider,
      this.program.programId,
    ).prepareExecuteSwapAccounts(opt);

    const {
      provider,
      program,
      marketAddress,
      marketProgramAddress,
      marketOpenOrders,
      pocketAccount,
      operator,
      pocketRegistry,
      baseMintVaultAccount,
      quoteMintVaultAccount,
      marketEventQueue,
      marketRequestQueue,
      marketAsks,
      marketBids,
      marketBaseVault,
      marketQuoteVault,
      marketAuthority,
    } = fixtures;

    const initInx = [];

    if (!(await provider.connection.getAccountInfo(marketOpenOrders))) {
      initInx.push(
        SystemProgram.createAccountWithSeed({
          basePubkey: operator.publicKey,
          fromPubkey: operator.publicKey,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(
            OpenOrders.getLayout(marketProgramAddress).span,
          ),
          newAccountPubkey: marketOpenOrders,
          programId: marketProgramAddress,
          seed: pocketAccount.toString().slice(0, 32),
          space: OpenOrders.getLayout(marketProgramAddress).span,
        }),
      );

      initInx.push(
        await program.methods
          .initSwapRegistry()
          .accounts({
            marketKey: marketAddress,
            authority: pocketAccount,
            openOrders: marketOpenOrders,
            dexProgram: marketProgramAddress,
            pocket: pocketAccount,
          })
          .instruction(),
      );
    }

    return program.methods
      .executeSwap()
      .accounts({
        // pocket accounts
        marketKey: marketAddress,
        signer: operator.publicKey,
        pocket: pocketAccount,
        pocketRegistry,
        pocketBaseTokenVault: baseMintVaultAccount,
        pocketQuoteTokenVault: quoteMintVaultAccount,
      })
      .preInstructions(initInx)
      .remainingAccounts([
        // serum dex accounts
        { pubkey: marketEventQueue, isSigner: false, isWritable: true },
        { pubkey: marketRequestQueue, isSigner: false, isWritable: true },
        { pubkey: marketBids, isSigner: false, isWritable: true },
        { pubkey: marketAsks, isSigner: false, isWritable: true },
        { pubkey: marketBaseVault, isSigner: false, isWritable: true },
        { pubkey: marketQuoteVault, isSigner: false, isWritable: true },
        { pubkey: marketAuthority, isSigner: false, isWritable: false },
        { pubkey: marketOpenOrders, isSigner: false, isWritable: true },
        { pubkey: marketProgramAddress, isSigner: false, isWritable: false },
      ])
      .signers([operator.payer])
      .rpc({ commitment: 'confirmed' });
  }
}
