export interface TokenMetadata {
  id: string;
  image: string;
  type: string;
  name: string;
  decimals?: number;
}

export class NonEvmConfig {
  rpcUrl: string;
  programAddress: string;
  whitelistedRouters: WhitelistedRouter[];
  explorerUrl: string;
  chainName: string;
  chainLogo: string;
}

export class WhitelistedRouter {
  address: string;
  isV3: boolean;
  ammTag: string;
  ammName: string;
  dexUrl: string;
}

export class EVMChainConfig {
  wagmiKey: string;
  chainName: string;
  chainLogo: string;
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
  programAddress: string;
  vaultAddress: string;
  registryAddress: string;
  whitelistedRouters: WhitelistedRouter[];
}

export class PlatformConfigEntity {
  solana: NonEvmConfig;
  ['aptos-testnet']: NonEvmConfig;
  polygon_mumbai: EVMChainConfig;
  bnb: EVMChainConfig;
  avaxc: EVMChainConfig;
  xdc: EVMChainConfig;
  okt: EVMChainConfig;
  gnosis: EVMChainConfig;
}
