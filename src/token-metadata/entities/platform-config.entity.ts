export interface TokenMetadata {
  id: string;
  image: string;
  type: string;
  name: string;
  decimals?: number;
}

export class SolanaConfig {
  rpcUrl: string;
  programAddress: string;
  mainDex: string;
}

export class WhitelistedRouter {
  address: string;
  isV3: boolean;
}

export class EVMChainConfig {
  rpcUrl: string;
  chainId: number;
  programAddress: string;
  vaultAddress: string;
  registryAddress: string;
  mainDex: string;
  whitelistedRouters: WhitelistedRouter[];
}

export class PlatformConfigEntity {
  solana: SolanaConfig;
  polygon_mumbai: EVMChainConfig;
  bnb: EVMChainConfig;
}
