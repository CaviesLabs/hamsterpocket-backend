import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { PoolController } from './controllers/pool.controller';
import { PoolMockService } from './services/pool-mock.service';
import { PoolService } from './services/pool.service';

@Module({
  imports: [OrmModule],
  providers: [RegistryProvider, PoolService, PoolMockService],
  controllers: [PoolController],
})
export class PoolModule {}
