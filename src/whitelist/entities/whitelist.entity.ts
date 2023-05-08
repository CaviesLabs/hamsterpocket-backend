import { ChainID } from '../../pool/entities/pool.entity';

export enum EntityType {
  TOKEN = 'token',
  NFT = 'nft',
}

export class WhitelistEntity {
  id: string;

  chainId: ChainID;

  address: string;

  entityType: EntityType;

  name: string;

  symbol: string;

  image: string;

  decimals?: number;

  /** In Dollars */
  estimatedValue?: number;
}
