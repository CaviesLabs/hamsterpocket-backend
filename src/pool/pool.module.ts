import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { PoolMockService } from './services/pool-mock.service';

@Module({
  imports: [OrmModule],
  providers: [RegistryProvider, PoolMockService],
  controllers: [],
})
export class PoolModule {}
