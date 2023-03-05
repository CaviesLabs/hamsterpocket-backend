export class MarketEntity {
  id: string;

  baseMint: string;
  quoteMint: string;

  lpMint: string;

  baseDecimals: number;

  quoteDecimals: number;

  lpDecimals: number;

  version: number;

  programId: string;

  authority: string;

  openOrders: string;

  targetOrders: string;

  baseVault: string;

  quoteVault: string;

  withdrawQueue: string;

  lpVault: string;

  marketVersion: number;

  marketProgramId: string;

  marketId: string;

  marketAuthority: string;

  marketBaseVault: string;

  marketQuoteVault: string;

  marketBids: string;

  marketAsks: string;

  marketEventQueue: string;

  lookupTableAccount: string;
}
