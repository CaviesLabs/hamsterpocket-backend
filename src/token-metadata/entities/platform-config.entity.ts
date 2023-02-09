export interface TokenMetadata {
  id: string;
  image: string;
  type: string;
  name: string;
  decimals?: number;
}

export class PlatformConfigEntity {
  maxAllowedOptions: number;
  maxAllowedItems: number;
  allowCurrencies: TokenMetadata[];
}
