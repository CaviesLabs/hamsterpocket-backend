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
      bnb: {
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
        whitelistedRouters: [
          {
            address: '0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897',
            isV3: true,
            ammTag: 'uniswap',
            ammName: 'Uniswap',
            dexUrl: 'https://app.uniswap.org/#/swap/',
          },
          {
            address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            isV3: false,
            ammTag: 'pancakeswap',
            ammName: 'Pancake Swap',
            dexUrl: 'https://pancakeswap.finance/swap/',
          },
        ],
      },
      okt: {
        chainName: 'OKT',
        chainLogo:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/8267.png',
        rpcUrl: this.getConfig().NETWORKS['okt'].RPC_URL,
        chainId: this.getConfig().NETWORKS['okt'].CHAIN_ID,
        programAddress: this.getConfig().NETWORKS['okt'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['okt'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['okt'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        explorerUrl: 'https://oklink.com/oktc/',
        whitelistedRouters: [
          {
            address: '0xc97b81B8a38b9146010Df85f1Ac714aFE1554343',
            isV3: false,
            ammTag: 'okswap',
            ammName: 'OKTC Swap',
            dexUrl: 'https://www.okx.com/oktc/swap/trade',
          },
        ],
      },
      gnosis: {
        chainName: 'Gnosis',
        chainLogo:
          'https://gnosisscan.io/images/svg/brands/main.svg?v=23.5.3.0',
        rpcUrl: this.getConfig().NETWORKS['gnosis'].RPC_URL,
        chainId: this.getConfig().NETWORKS['gnosis'].CHAIN_ID,
        programAddress:
          this.getConfig().NETWORKS['gnosis'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['gnosis'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['gnosis'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        explorerUrl: 'https://gnosisscan.io/',
        whitelistedRouters: [
          {
            address: '0x1c232f01118cb8b424793ae03f870aa7d0ac7f77',
            isV3: false,
            ammTag: 'honeyswap',
            ammName: 'Honey Swap',
            dexUrl: 'https://honeyswap.1hive.eth.limo/',
          },
        ],
      },
      solana: {
        chainName: 'Solana',
        chainLogo:
          'https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422',
        rpcUrl: this.getConfig().NETWORKS['solana'].RPC_URL,
        explorerUrl: 'https://solscan.io/',
        programAddress:
          this.getConfig().NETWORKS['solana'].POCKET_PROGRAM_ADDRESS,
        whitelistedRouters: [
          {
            address: '',
            isV3: false,
            ammTag: 'raydium',
            ammName: 'Raydium Swap',
            dexUrl: 'https://raydium.io/swap/',
          },
        ],
      },
      xdc: {
        chainName: 'XDC',
        chainLogo:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/2634.png',
        rpcUrl: this.getConfig().NETWORKS['xdc'].RPC_URL,
        chainId: this.getConfig().NETWORKS['xdc'].CHAIN_ID,
        programAddress: this.getConfig().NETWORKS['xdc'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          this.getConfig().NETWORKS['xdc'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['xdc'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        explorerUrl: 'https://xdcscan.io/',
        whitelistedRouters: [
          {
            address: '0xf9c5E4f6E627201aB2d6FB6391239738Cf4bDcf9',
            isV3: false,
            ammTag: 'xspswap',
            ammName: 'XSP Swap',
            dexUrl: 'https://app.xspswap.finance/swap',
          },
        ],
      },
      polygon_mumbai: {
        chainName: 'Mumbai',
        chainLogo:
          'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
        rpcUrl: this.getConfig().NETWORKS['polygon_mumbai'].RPC_URL,
        chainId: this.getConfig().NETWORKS['polygon_mumbai'].CHAIN_ID,
        programAddress:
          this.getConfig().NETWORKS['polygon_mumbai'].POCKET_PROGRAM_ADDRESS,
        explorerUrl: 'https://mumbai.polygonscan.com/',
        vaultAddress:
          this.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          this.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_REGISTRY_PROGRAM_ADDRESS,
        whitelistedRouters: [
          {
            address: '0x4648a43B2C14Da09FdF82B161150d3F634f40491',
            isV3: true,
            ammTag: 'uniswap',
            ammName: 'Uniswap',
            dexUrl: 'https://app.uniswap.org/#/swap',
          },
        ],
      },
    };
  }
}
