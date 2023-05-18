import { ChainID } from '../../pool/entities/pool.entity';

export enum EntityType {
  TOKEN = 'token',
  NFT = 'nft',
}

export class WhitelistEntity {
  id: string;

  chainId: ChainID;

  isNativeCoin: boolean;

  address: string;

  entityType: EntityType;

  name: string;

  symbol: string;

  image: string;

  coingeckoId: string;

  decimals?: number;

  /** In Dollars */
  estimatedValue?: number;
}
