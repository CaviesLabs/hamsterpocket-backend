import { Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsIn, IsNotEmpty, IsString, IsUrl, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';
import { DatabaseType } from 'typeorm';

export class SystemConfig {
  /**
   * @description Environment configs
   */
  @IsString()
  @IsNotEmpty()
  NODE_ENV;

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
  @IsNotEmpty()
  PORT: number;

  /**
   * @description Declare private key
   */
  @IsString()
  @IsNotEmpty()
  PRIVATE_KEY: string;

  /**
   * @description Declare public key
   */
  @IsString()
  @IsNotEmpty()
  PUBLIC_KEY: string;

  /**
   * @description Declare default audience
   */
  @IsString()
  @IsNotEmpty()
  DEFAULT_AUDIENCE: string;

  /**
   * @description Database Config
   */
  @IsString()
  @IsIn(['postgres', 'mysql', 'sqlite'])
  DB_ENGINE: DatabaseType;

  @IsUrl(
    { protocols: ['postgresql'], require_tld: false },
    {
      message: '$property should be a valid Postgres URL',
    },
  )
  DB_URL: string;

  /**
   * @description Other Configs
   */
  @IsUrl({
    require_protocol: false,
  })
  DOMAIN: string;

  @IsString()
  @IsNotEmpty()
  SOLANA_CLUSTER: string;

  @IsString()
  @IsNotEmpty()
  SWAP_PROGRAM_ADDRESS: string;

  public validate() {
    /***
     * Validate config schema.
     */
    const errors = validateSync(this);
    /**
     * Raise error if the config isn't valid
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
     * Load the config object single time.
     */
    if (!RegistryProvider.config) RegistryProvider.load();
  }

  /**
   * Load config from file.
   */
  private static load() {
    /**
     * Inject config service
     */
    const configService = new ConfigService();

    /**
     * Read credentials file
     */
    const configFilePath = configService.get<string>('CONFIG_FILE', null);
    if (!configFilePath) {
      throw new Error('APPLICATION_BOOT::CONFIG_FILE_NOT_SET');
    }
    const file = fs.readFileSync(configFilePath);

    /**
     * Construct system config
     */
    const data: SystemConfig = {
      /**
       * load API_VERSION from package.json
       */
      API_VERSION: configService.get('npm_package_version', '0.0.0'),
      ...JSON.parse(file.toString()),
    };

    /**
     * Transform config
     */
    RegistryProvider.config = plainToInstance(SystemConfig, data);
    RegistryProvider.config.validate();

    /**
     * Make config object immutable
     */
    Object.freeze(RegistryProvider.config);
  }

  /**
   * Get the config.
   * @returns System config object.
   */
  public getConfig(): SystemConfig {
    return RegistryProvider.config;
  }
}
