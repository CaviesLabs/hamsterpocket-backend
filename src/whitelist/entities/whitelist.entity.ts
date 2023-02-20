export enum EntityType {
  TOKEN = 'token',
  NFT = 'nft',
}

export class WhitelistEntity {
  id: string;

  coinGeckoId: string;

  address: string;

  entityType: EntityType;

  name: string;

  symbol: string;

  image: string;

  decimals?: number;

  /** In Dollars */
  estimatedValue?: number;
}
