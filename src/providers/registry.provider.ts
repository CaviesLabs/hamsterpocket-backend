import { Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IsBoolean,
  IsNotEmpty,
  IsPort,
  IsString,
  IsUrl,
  validateSync,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';

import * as fs from 'fs';

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
  @IsUrl(
    { protocols: ['mongodb'], require_tld: false },
    {
      message: '$property should be a valid MongoDB URL',
    },
  )
  DB_URL: string;

  /**
   * @description SMTP Configs
   */
  @IsUrl({
    require_protocol: false,
  })
  SMTP_EMAIL_HOST: string;

  @IsPort()
  @IsNotEmpty()
  SMTP_EMAIL_PORT: string;

  @IsBoolean()
  @IsNotEmpty()
  SMTP_EMAIL_TLS_ENABLED: boolean;

  @IsString()
  @IsNotEmpty()
  SMTP_EMAIL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  SMTP_EMAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  SMTP_EMAIL_FROM_EMAIL: string;

  @IsString()
  @IsNotEmpty()
  SMTP_EMAIL_FROM_EMAIL_NAME: string;

  /**
   * @description AWS Configs
   */
  @IsString()
  @IsNotEmpty()
  AWS_SECRET_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  AWS_BUCKET_NAME: string;

  @IsString()
  @IsNotEmpty()
  AWS_BUCKET_REGION: string;

  /**
   * @description Other Configs
   */
  @IsString()
  @IsNotEmpty()
  SECRET_TOKEN: string;

  @IsUrl({
    require_protocol: false,
  })
  DOMAIN: string;

  @IsUrl({
    require_protocol: true,
  })
  HOST_URI: string;

  @IsString()
  @IsNotEmpty()
  SOLANA_CLUSTER: string;

  @IsString()
  @IsNotEmpty()
  SWAP_PROGRAM_ADDRESS: string;

  @IsString()
  @IsNotEmpty()
  SOLSCAN_API_KEY: string;

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
}
