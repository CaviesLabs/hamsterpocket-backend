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
  whitelistedRouters: WhitelistedRouter[];
  explorerUrl: string;
  chainName: string;
  chainLogo: string;
  nativeToken: {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
  };
}

export class AptosConfig {
  rpcUrl: string;
  programAddress: string;
  whitelistedRouters: WhitelistedRouter[];
  explorerUrl: string;
  chainName: string;
  chainLogo: string;
  graphQLUrl: string;
  nativeToken: {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
  };
}

export class WhitelistedRouter {
  address: string;
  isV3: boolean;
  routerVersion: '0' | '1' | '2'; // V3, V2, or V3NonUniversal
  ammTag: string;
  ammName: string;
  dexUrl: string;
  inputTag: string;
  outputTag: string;
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
  nativeToken: {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
  };
}

export class PlatformConfigEntity {
  solana: SolanaConfig;
  aptos: AptosConfig;
  bnb: EVMChainConfig;
  avaxc: EVMChainConfig;
  scroll_sepolia: EVMChainConfig;
  klaytn: EVMChainConfig;
  mantle: EVMChainConfig;
}
