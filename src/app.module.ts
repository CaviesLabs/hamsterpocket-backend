import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
// import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { TokenMetadataModule } from './token-metadata/token-metadata.module';
import { getMemoryServerMongoUri } from './orm/helper';
import { RegistryProvider } from './providers/registry.provider';
import { AllExceptionsFilter } from './exception.filter';
import { AppController } from './app.controller';
import { PoolModule } from './pool/pool.module';
import { BullModule } from '@nestjs/bull';
import { PortfolioModule } from './portfolio/portfolio.module';
import { getRedisMemoryServerURI } from './mq/helper';
import { WhitelistModule } from './whitelist/whitelist.module';

@Module({
  imports: [
    /**
     * @dev Still enable config module
     */
    ConfigModule.forRoot(),

    // /**
    //  * @dev Enable rate limit.
    //  */
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 100,
    // }),

    /**
     * @dev Enable schedule module.
     */
    ScheduleModule.forRoot(),
    /**
     * @dev Initialize database
     */
    MongooseModule.forRootAsync({
      /**
       * @dev need to override the useFactory
       */
      useFactory: async () => {
        /**
         * @dev Extract env.
         */
        const registry = new RegistryProvider();
        const env = registry.getConfig().NODE_ENV;
        let uri;

        /**
         * @dev For test env we can just use memory server uri.
         */
        if (env === 'test') uri = await getMemoryServerMongoUri();
        else uri = registry.getConfig().DB_URL;

        /**
         * @dev Return the uri.
         */
        return {
          uri,
        };
      },
    }),
    BullModule.forRootAsync({
      useFactory: async () => {
        const registry = new RegistryProvider();
        const env = registry.getConfig().NODE_ENV;
        let uri;

        if (env === 'test') {
          uri = await getRedisMemoryServerURI();
        } else {
          uri = registry.getConfig().REDIS_URI;
        }

        return {
          redis: uri,
        };
      },
    }),
    /**
     * @dev Import other modules.
     */
    TokenMetadataModule,
    WhitelistModule,
    PoolModule,
    PortfolioModule,
  ],
  /**
   * @dev Import controller.
   */
  controllers: [AppController],

  /**
   * @dev Import main service.
   */
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
