import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { RegistryProvider } from '../../providers/registry.provider';
import { FindPoolActivityDto } from '../dtos/find-pool-activity.dto';
import { FindPoolDto } from '../dtos/find-pool.dto';
import { PoolActivityEntity } from '../entities/pool-activity.entity';
import { PoolActivityService } from '../services/pool-activity.service';
import { PoolMockService } from '../services/pool-mock.service';
import { PoolService } from '../services/pool.service';
import { SyncPoolActivityService } from '../services/sync-pool-activity.service';
import { SyncPoolService } from '../services/sync-pool.service';

@Controller('pool')
@ApiTags('pool')
export class PoolController {
  constructor(
    private readonly registry: RegistryProvider,
    private readonly poolService: PoolService,
    private readonly syncPoolService: SyncPoolService,
    private readonly poolMockService: PoolMockService,
    private readonly poolActivityService: PoolActivityService,
    private readonly syncPoolActivityService: SyncPoolActivityService,
  ) {}

  @Get()
  find(
    @Query() { search, limit, offset }: CommonQueryDto,
    @Query() { ownerAddress, statuses, sortBy }: FindPoolDto,
  ) {
    return this.poolService.find({
      search,
      limit,
      offset,
      ownerAddress,
      statuses,
      sortBy,
    });
  }

  @Post('/:ownerAddress')
  createEmpty(@Param('ownerAddress') ownerAddress: string) {
    return this.poolService.createEmpty(ownerAddress);
  }

  @Post('/:id/sync')
  async syncOne(@Param('id') id: string) {
    await this.syncPoolService.syncPoolById(id);
    await this.syncPoolActivityService.syncPoolActivities(id, true);
  }

  @Post('/user/:ownerAddress/sync')
  syncByOwnerAddress(@Param('ownerAddress') ownerAddress: string) {
    return this.syncPoolService.syncPoolsByOwnerAddress(ownerAddress);
  }

  @Get('/activity')
  async getPoolActivities(
    @Query() { limit, offset, search }: CommonQueryDto,
    @Query() { ownerAddress, timeFrom, timeTo, statuses }: FindPoolActivityDto,
  ): Promise<PoolActivityEntity[]> {
    return this.poolActivityService.find({
      ownerAddress,
      timeFrom,
      timeTo,
      statuses,
      limit,
      offset,
      search,
    });
  }

  @Post('/:id/activity/sync')
  async syncPoolActivities(@Param('id') poolId: string) {
    await this.syncPoolActivityService.syncPoolActivities(poolId);
  }

  @Post('/mock/generate')
  async generateMock(@Query('ownerAddress') ownerAddress: string) {
    if (this.registry.getConfig().NODE_ENV == 'production') {
      throw new NotImplementedException('API is not supported in production');
    }

    return this.poolMockService.generate(ownerAddress);
  }
}
