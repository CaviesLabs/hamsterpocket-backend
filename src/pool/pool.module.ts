import { Module } from '@nestjs/common';
import { OrmModule } from '../orm/orm.module';
import { RegistryProvider } from '../providers/registry.provider';
import { PoolSeederService } from './services/pool-seeder.service';

@Module({
  imports: [OrmModule],
  providers: [RegistryProvider, PoolSeederService],
  controllers: [],
})
export class PoolModule {}
