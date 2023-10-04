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
}

export class AptosConfig {
  rpcUrl: string;
  programAddress: string;
  whitelistedRouters: WhitelistedRouter[];
  explorerUrl: string;
  chainName: string;
  chainLogo: string;
  graphQLUrl: string;
}

export class WhitelistedRouter {
  address: string;
  isV3: boolean;
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
}

export class PlatformConfigEntity {
  solana: SolanaConfig;
  aptos: AptosConfig;
  bnb: EVMChainConfig;
  avaxc: EVMChainConfig;
  klaytn: EVMChainConfig;
}
