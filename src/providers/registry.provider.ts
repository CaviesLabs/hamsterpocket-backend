import { Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IsNotEmpty,
  IsObject,
  IsPort,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

import * as fs from 'fs';
import { PlatformConfigEntity } from '../token-metadata/entities/platform-config.entity';

export class SystemConfig {
  /**
   * @description Environment configs
   */
  @IsString()
  @IsNotEmpty()
  NODE_ENV;

  /**
   * @dev the version of current runner
   */
  @IsString()
  API_VERSION: string;

  /**
   * @description PORT and HOST config
   */
  @IsUrl({
    require_protocol: false,
  })
  HOST: string;

  /**
   * @description Port config
   */
  @IsPort()
  @IsNotEmpty()
  PORT: string;

  /**
   * @description Database Config
   */
  @IsUrl(
    { protocols: ['mongodb'], require_tld: false },
    {
      message: '$property should be a valid MongoDB URL',
    },
  )
  DB_URL: string;

  @IsUrl(
    { protocols: ['redis'], require_tld: false },
    {
      message: '$property should be a valid Redis URI',
    },
  )
  REDIS_URI: string;

  /**
   * @description Other Configs
   */
  @IsString()
  @IsNotEmpty()
  SECRET_TOKEN: string;

  /**
   * @description Operator seed
   */
  @IsString()
  @IsNotEmpty()
  OPERATOR_SECRET_KEY: string;

  @IsUrl({
    require_protocol: false,
  })
  DOMAIN: string;

  @IsUrl({
    require_protocol: true,
  })
  HOST_URI: string;

  @IsObject()
  NETWORKS: object;

  /**
   * @dev Validate schema.
   */
  public ensureValidSchema() {
    /***
     * @dev Validate config schema.
     */
    const errors = validateSync(this);
    /**
     * @dev Raise error if the config isn't valid
     */
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors.map((elm) => elm.constraints)));
    }
  }
}

@Global()
export class RegistryProvider {
  private static config: SystemConfig;

  constructor() {
    /**
     * @dev Load the config object single time.
     */
    if (!RegistryProvider.config) RegistryProvider.load();
  }

  /**
   * @dev Load config from file.
   */
  private static load() {
    /**
     * @dev Inject config service
     */
    const configService = new ConfigService();

    /**
     * @dev Read credentials file
     */
    const configFilePath = configService.get<string>('CONFIG_FILE', null);
    if (!configFilePath) {
      throw new Error('APPLICATION_BOOT::CONFIG_FILE_NOT_SET');
    }
    const file = fs.readFileSync(configFilePath);

    /**
     * @dev Construct system config
     */
    const data: SystemConfig = {
      /**
       * @dev load API_VERSION from package.json
       */
      API_VERSION: configService.get('npm_package_version', '0.0.0'),
      ...JSON.parse(file.toString()),
    };

    /**
     * @dev Transform config
     */
    RegistryProvider.config = plainToInstance(SystemConfig, data);
    RegistryProvider.config.ensureValidSchema();

    /**
     * @dev Make config object immutable
     */
    Object.freeze(RegistryProvider.config);
  }

  /**
   * @dev Get the config.
   * @returns System config object.
   */
  public getConfig(): SystemConfig {
    return RegistryProvider.config;
  }

  public getChains(): PlatformConfigEntity {
    return {
      aptos: {
        chainName: 'Aptos',
        chainLogo:
          'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
        rpcUrl: this.getConfig().NETWORKS['aptos'].RPC_URL,
        graphQLUrl: this.getConfig().NETWORKS['aptos'].GRAPHQL_URL,
        explorerUrl: 'https://aptoscan.com/',
        programAddress:
          this.getConfig().NETWORKS['aptos'].POCKET_PROGRAM_ADDRESS,
        nativeToken: {
          name: 'Aptos',
          symbol: 'APT',
          decimals: 8,
          logo: 'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png?1666839629',
        },
        whitelistedRouters: [
          {
            address: '',
            isV3: false,
            routerVersion: '1',
            ammTag: 'pancakeswap',
            ammName: 'Pancake Swap',
            dexUrl: 'https://aptos.pancakeswap.finance/swap',
            inputTag: 'inputCurrency',
            outputTag: 'outputCurrency',
          },
        ],
      },
      bnb: {
        wagmiKey: 'bsc',
        chainName: 'BNB',
        chainLogo:
          'https://s3.coinmarketcap.com/static/img/portraits/62876e92bedeb632050eb4ae.png',
        rpcUrl: this.getConfig().NETWORKS['bnb'].RPC_URL,
        chainId: this.getConfig().NETWORKS['bnb'].CHAIN_ID,
        programAddress: this.getConfig().NETWORKS['bnb'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['bnb'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['bnb'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        explorerUrl: 'https://bscscan.com/',
        nativeToken: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
          logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1696479808',
        },
        whitelistedRouters: [
          {
            address: '0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897',
            isV3: true,
            routerVersion: '0',
            ammTag: 'uniswap',
            ammName: 'Uniswap',
            dexUrl: 'https://app.uniswap.org/#/swap/',
            inputTag: 'inputCurrency',
            outputTag: 'outputCurrency',
          },
          {
            address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            isV3: false,
            routerVersion: '1',
            ammTag: 'pancakeswap',
            ammName: 'Pancake Swap',
            dexUrl: 'https://pancakeswap.finance/swap/',
            inputTag: 'inputCurrency',
            outputTag: 'outputCurrency',
          },
        ],
      },
      mantle: {
        wagmiKey: 'mantle',
        chainName: 'Mantle',
        chainLogo:
          'https://assets.coingecko.com/coins/images/30980/small/token-logo.png?1689320029',
        rpcUrl: this.getConfig().NETWORKS['mantle'].RPC_URL,
        chainId: this.getConfig().NETWORKS['mantle'].CHAIN_ID,
        programAddress:
          this.getConfig().NETWORKS['mantle'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['mantle'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['mantle'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        nativeToken: {
          name: 'Mantle',
          symbol: 'MNT',
          decimals: 18,
          logo: 'https://assets.coingecko.com/coins/images/30980/small/token-logo.png?1689320029',
        },
        explorerUrl: 'https://explorer.mantle.xyz/',
        whitelistedRouters: [
          {
            address: '0x319B69888b0d11cEC22caA5034e25FfFBDc88421',
            isV3: true,
            routerVersion: '2',
            ammTag: 'agni',
            ammName: 'Agni',
            dexUrl: 'https://agni.finance/swap/',
            inputTag: 'inputCurrency',
            outputTag: 'outputCurrency',
          },
        ],
      },
      scroll_sepolia: {
        wagmiKey: 'scroll_sepolia',
        chainName: 'Scroll Sepolia',
        chainLogo:
          'https://uniswap-v3.scroll.io/static/media/scroll_logo.7578cf7e.svg',
        rpcUrl: this.getConfig().NETWORKS['scroll_sepolia'].RPC_URL,
        chainId: this.getConfig().NETWORKS['scroll_sepolia'].CHAIN_ID,
        programAddress:
          this.getConfig().NETWORKS['scroll_sepolia'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['scroll_sepolia']
            .POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['scroll_sepolia']
            .POCKET_REGISTRY_PROGRAM_ADDRESS,
        nativeToken: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        },
        explorerUrl: 'https://sepolia.scrollscan.dev/',
        whitelistedRouters: [
          {
            address: '0x59a662Ed724F19AD019307126CbEBdcF4b57d6B1',
            isV3: true,
            routerVersion: '2',
            ammTag: 'rubic',
            ammName: 'Rubic Exchange',
            dexUrl:
              'https://testnet.rubic.exchange/?fromChain=SCROLL_SEPOLIA&toChain=SCROLL_SEPOLIA',
            inputTag: 'from',
            outputTag: 'to',
          },
        ],
      },
      klaytn: {
        wagmiKey: 'klaytn',
        chainName: 'Klaytn',
        chainLogo:
          'https://assets.coingecko.com/coins/images/9672/small/klaytn.png?1660288824',
        rpcUrl: this.getConfig().NETWORKS['klaytn'].RPC_URL,
        chainId: this.getConfig().NETWORKS['klaytn'].CHAIN_ID,
        programAddress:
          this.getConfig().NETWORKS['klaytn'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['klaytn'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['klaytn'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        explorerUrl: 'https://scope.klaytn.com/',
        nativeToken: {
          name: 'Klaytn',
          symbol: 'KLAY',
          decimals: 18,
          logo: 'https://assets.coingecko.com/coins/images/9672/small/klaytn.png?1660288824',
        },
        whitelistedRouters: [
          {
            address: '0xEf71750C100f7918d6Ded239Ff1CF09E81dEA92D',
            isV3: false,
            routerVersion: '1',
            ammTag: 'claimswap',
            ammName: 'ClaimSwap',
            dexUrl: 'https://claimswap.org/trade',
            inputTag: 'tokenA',
            outputTag: 'tokenB',
          },
        ],
      },
      avaxc: {
        wagmiKey: 'avalanche',
        chainName: 'AVAX-C',
        chainLogo:
          'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png?1670992574',
        rpcUrl: this.getConfig().NETWORKS['avaxc'].RPC_URL,
        chainId: this.getConfig().NETWORKS['avaxc'].CHAIN_ID,
        programAddress:
          this.getConfig().NETWORKS['avaxc'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['avaxc'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['avaxc'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        explorerUrl: 'https://snowtrace.io/',
        nativeToken: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
          logo: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png?1670992574',
        },
        whitelistedRouters: [
          {
            address: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
            isV3: false,
            routerVersion: '1',
            ammTag: 'traderjoe',
            ammName: 'TraderJoe',
            dexUrl: 'https://traderjoexyz.com/avalanche/trade',
            inputTag: 'inputCurrency',
            outputTag: 'outputCurrency',
          },
        ],
      },
      solana: {
        chainName: 'Solana',
        chainLogo:
          'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        rpcUrl: this.getConfig().NETWORKS['solana'].RPC_URL,
        explorerUrl: 'https://solscan.io/',
        programAddress:
          this.getConfig().NETWORKS['solana'].POCKET_PROGRAM_ADDRESS,
        nativeToken: {
          name: 'Solana',
          symbol: 'SOL',
          decimals: 9,
          logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        },
        whitelistedRouters: [
          {
            address: '',
            isV3: false,
            routerVersion: '1',
            ammTag: 'raydium',
            ammName: 'Raydium Swap',
            dexUrl: 'https://raydium.io/swap/',
            inputTag: 'inputCurrency',
            outputTag: 'outputCurrency',
          },
        ],
      },
    };
  }
}
