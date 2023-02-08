import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { APP_FILTER } from '@nestjs/core';

/** Import modules */
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { OrmModule } from './orm/orm.module';
import { UserModule } from './user/user.module';

/** Import providers */
import { RegistryProvider } from './providers/registry.provider';
import { getDataSourceConfig } from './orm/type-orm.config';
import { AllExceptionsFilter } from './exception.filter';

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...getDataSourceConfig(new RegistryProvider()),
          migrations: [__dirname + '/orm/migrations/*-Migration.js'],
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
        };
      },
      dataSourceFactory: async (config) => new DataSource(config),
    }),
    OrmModule,
    UserModule,
    AuthModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
