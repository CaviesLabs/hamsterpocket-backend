import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { PoolController } from './controllers/pool.controller';
import { PoolMockService } from './services/pool-mock.service';
import { PoolService } from './services/pool.service';
import { SyncPoolService } from './services/sync-pool.service';

@Module({
  imports: [OrmModule],
  providers: [RegistryProvider, PoolService, SyncPoolService, PoolMockService],
  controllers: [PoolController],
})
export class PoolModule {}
