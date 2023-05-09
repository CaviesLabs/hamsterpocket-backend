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
import { CreateEmptyPoolDto } from '../dtos/create-empty-pool.dto';
import { SyncEvmPoolService } from '../services/sync-evm-pool.service';
import { SyncEvmPoolActivityService } from '../services/sync-evm-pool-activity.service';

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
    private readonly syncEVMPoolService: SyncEvmPoolService,
    private readonly syncEvmPoolActivityService: SyncEvmPoolActivityService,
  ) {}

  @Get()
  find(
    @Query() { search, limit, offset }: CommonQueryDto,
    @Query() { ownerAddress, statuses, sortBy, chainId }: FindPoolDto,
  ) {
    return this.poolService.find({
      search,
      chainId,
      limit,
      offset,
      ownerAddress,
      statuses,
      sortBy,
    });
  }

  @Post('/:chainId/:ownerAddress')
  createEmpty(@Param() params: CreateEmptyPoolDto) {
    return this.poolService.createEmpty(params.ownerAddress, params.chainId);
  }

  @Get('/:id/')
  async getPocketDetails(@Param('id') id: string) {
    return this.poolService.getPoolDetail(id);
  }

  @Get('/:id/activities')
  async getPocketActivities(@Param('id') id: string) {
    return this.poolActivityService.getPoolActivities(id);
  }

  @Post('/evm/:id/sync')
  async evmSyncSinglePocket(@Param('id') id: string) {
    await this.syncEVMPoolService.syncPoolById(id);
  }

  @Post('/user/evm/:ownerAddress/sync')
  evmSyncByOwnerAddress(@Param('ownerAddress') ownerAddress: string) {
    return this.syncEVMPoolService.syncPoolsByOwnerAddress(ownerAddress);
  }

  @Post('/evm/activity/sync')
  async evmSyncPoolActivities() {
    await this.syncEvmPoolActivityService.syncAllPoolActivities();
  }

  @Post('/:id/sync')
  async syncOne(@Param('id') id: string) {
    await this.syncPoolService.syncPoolById(id);
  }

  @Post('/user/:ownerAddress/sync')
  syncByOwnerAddress(@Param('ownerAddress') ownerAddress: string) {
    return this.syncPoolService.syncPoolsByOwnerAddress(ownerAddress);
  }

  @Post('/:id/activity/sync')
  async syncPoolActivities(@Param('id') poolId: string) {
    await this.syncPoolActivityService.syncPoolActivities(poolId);
  }

  @Get('/activity')
  async getPoolActivities(
    @Query() { limit, offset, search }: CommonQueryDto,
    @Query()
    { ownerAddress, timeFrom, chainId, timeTo, statuses }: FindPoolActivityDto,
  ): Promise<PoolActivityEntity[]> {
    return this.poolActivityService.find({
      chainId,
      ownerAddress,
      timeFrom,
      timeTo,
      statuses,
      limit,
      offset,
      search,
    });
  }

  @Post('/mock/generate')
  async generateMock(@Query('ownerAddress') ownerAddress: string) {
    if (this.registry.getConfig().NODE_ENV == 'production') {
      throw new NotImplementedException('API is not supported in production');
    }

    return this.poolMockService.generate(ownerAddress);
  }
}
