import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { parseRedisUrl } from 'parse-redis-url-simple';

import { TokenMetadataModule } from './token-metadata/token-metadata.module';
import { getMemoryServerMongoUri } from './orm/helper';
import { RegistryProvider } from './providers/registry.provider';
import { PoolModule } from './pool/pool.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { getRedisMemoryServerURI } from './mq/helper';
import { WhitelistModule } from './whitelist/whitelist.module';
import { OrmModule } from './orm/orm.module';
import { MqModule } from './mq/mq.module';

@Module({
  imports: [
    /**
     * @dev Still enable config module
     */
    ConfigModule.forRoot(),

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

        const [redis] = parseRedisUrl(uri);

        return {
          redis: {
            host: redis.host,
            port: Number(redis.port),
            password: redis.password,
            keepAlive: 1,
            db: Number(redis.database || 0),
          },
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
    OrmModule,
    MqModule,
  ],
})
export class WorkerModule {}
