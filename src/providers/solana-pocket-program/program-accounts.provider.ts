import * as anchor from '@project-serum/anchor';
import { AnchorProvider } from '@project-serum/anchor';
import { Market } from '@openbook-dex/openbook';
import { PublicKey } from '@solana/web3.js';

import { IDL } from './pocket.idl';

export class ProgramAccountsProvider {
  constructor(
    private readonly provider: AnchorProvider,
    private readonly pocketProgramId: PublicKey,
  ) {}

  public async prepareExecuteSwapAccounts(opt: {
    pocketId: string;
    baseMint: string;
    quoteMint: string;
    marketKey: string;
    marketProgramId: string;
    marketAuthority: string;
  }) {
    /**
     * @dev Prepare provider stuffs
     */
    const provider = this.provider;

    // Configure the client to use the local cluster.
    anchor.setProvider(provider);
    provider.opts.commitment = 'confirmed';

    /**
     * @dev Handle pocket program stuffs
     */
    const program = new anchor.Program(IDL, this.pocketProgramId);
    const operator = provider.wallet as anchor.Wallet;

    // find the pocket account
    const [pocketRegistry] = PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode('SEED::POCKET::PLATFORM')],
      program.programId,
    );

    // find the pocket account
    const [pocketAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('SEED::POCKET::POCKET_SEED'),
        anchor.utils.bytes.utf8.encode(opt.pocketId),
      ],
      program.programId,
    );

    const baseMintAccount = new PublicKey(opt.baseMint);
    const [baseMintVaultAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('SEED::POCKET::TOKEN_VAULT_SEED'),
        pocketAccount.toBytes(),
        baseMintAccount.toBytes(),
      ],
      program.programId,
    );

    const quoteMintAccount = new PublicKey(opt.quoteMint);
    const [quoteMintVaultAccount] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('SEED::POCKET::TOKEN_VAULT_SEED'),
        pocketAccount.toBytes(),
        quoteMintAccount.toBytes(),
      ],
      program.programId,
    );

    /**
     * @dev Handle serum market stuffs
     */
    const marketAddress = new PublicKey(opt.marketKey);
    const marketProgramAddress = new PublicKey(opt.marketProgramId);

    const market = await Market.load(
      provider.connection,
      marketAddress,
      {},
      marketProgramAddress,
    );

    // const desiredOpenOrderAccount = new Keypair();
    const marketOpenOrders = await PublicKey.createWithSeed(
      operator.publicKey,
      pocketAccount.toString().slice(0, 32),
      marketProgramAddress,
    );

    return {
      provider,
      operator,
      pocketId: opt.pocketId,
      program,
      pocketRegistry,
      pocketAccount,
      baseMintAccount,
      baseMintVaultAccount,
      quoteMintAccount,
      quoteMintVaultAccount,
      marketAddress,
      marketProgramAddress,
      marketOpenOrders,
      marketEventQueue: market.decoded.eventQueue,
      marketRequestQueue: market.decoded.requestQueue,
      marketBids: market.decoded.bids,
      marketAsks: market.decoded.asks,
      marketBaseVault: market.decoded.baseVault,
      marketQuoteVault: market.decoded.quoteVault,
      marketAuthority: new PublicKey(opt.marketAuthority),
    };
  }
}
