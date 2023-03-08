import {
  Controller,
  Get,
  NotImplementedException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { RegistryProvider } from '../../providers/registry.provider';
import { FindPoolActivityDto } from '../dtos/find-pool-activity.dto';
import { FindPoolDto } from '../dtos/find-pool.dto';
import {
  ActivityType,
  PoolActivityEntity,
  PoolActivityStatus,
} from '../entities/pool-activity.entity';
import { PoolMockService } from '../services/pool-mock.service';
import { PoolService } from '../services/pool.service';
import { SyncPoolService } from '../services/sync-pool.service';

@Controller('pool')
@ApiTags('pool')
export class PoolController {
  constructor(
    private readonly registry: RegistryProvider,
    private readonly poolService: PoolService,
    private readonly syncPoolService: SyncPoolService,
    private readonly poolMockService: PoolMockService,
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

  @Post()
  createEmpty() {
    return this.poolService.createEmpty();
  }

  @Post('/:id/sync')
  syncOne(@Param('id') id: string) {
    return this.syncPoolService.syncPoolById(id);
  }

  @Post('/user/:ownerAddress/sync')
  syncByOwnerAddress(@Param('ownerAddress') ownerAddress: string) {
    return this.syncPoolService.syncPoolsByOwnerAddress(ownerAddress);
  }

  @Get('/activity')
  async getPoolActivities(
    @Query() query: FindPoolActivityDto,
  ): Promise<PoolActivityEntity[]> {
    console.log(query);
    return [
      {
        poolId: new Types.ObjectId(),
        baseTokenAmount: 100,
        targetTokenAmount: 0,
        status: PoolActivityStatus.SUCCESSFUL,
        transactionId:
          '469qjjQfqYKdYiogKrCGdgBSWT2Ufi1pXdUxVFZj22roEvLswbmCctySyMhvPnjqoaUkFw6hfr3Tx6zohwrtLDh3',
        type: ActivityType.DEPOSITED,
        memo: '',
        createdAt: new Date(),
      },
      {
        poolId: new Types.ObjectId(),
        baseTokenAmount: 90,
        targetTokenAmount: 10,
        status: PoolActivityStatus.SUCCESSFUL,
        transactionId:
          '469qjjQfqYKdYiogKrCGdgBSWT2Ufi1pXdUxVFZj22roEvLswbmCctySyMhvPnjqoaUkFw6hfr3Tx6zohwrtLDh3',
        type: ActivityType.SWAPPED,
        memo: '',
        createdAt: new Date(),
      },
      {
        poolId: new Types.ObjectId(),
        baseTokenAmount: 90,
        targetTokenAmount: 10,
        status: PoolActivityStatus.SUCCESSFUL,
        transactionId:
          '469qjjQfqYKdYiogKrCGdgBSWT2Ufi1pXdUxVFZj22roEvLswbmCctySyMhvPnjqoaUkFw6hfr3Tx6zohwrtLDh3',
        type: ActivityType.SKIPPED,
        memo: '',
        createdAt: new Date(),
      },
      {
        poolId: new Types.ObjectId(),
        baseTokenAmount: 90,
        targetTokenAmount: 10,
        status: PoolActivityStatus.FAILED,
        transactionId:
          '469qjjQfqYKdYiogKrCGdgBSWT2Ufi1pXdUxVFZj22roEvLswbmCctySyMhvPnjqoaUkFw6hfr3Tx6zohwrtLDh3',
        type: ActivityType.SWAPPED,
        memo: '',
        createdAt: new Date(),
      },
      {
        poolId: new Types.ObjectId(),
        baseTokenAmount: 0,
        targetTokenAmount: 0,
        status: PoolActivityStatus.SUCCESSFUL,
        transactionId:
          '469qjjQfqYKdYiogKrCGdgBSWT2Ufi1pXdUxVFZj22roEvLswbmCctySyMhvPnjqoaUkFw6hfr3Tx6zohwrtLDh3',
        type: ActivityType.WITHDRAWN,
        memo: '',
        createdAt: new Date(),
      },
    ];
  }

  @Post('/mock/generate')
  async generateMock(@Query('ownerAddress') ownerAddress: string) {
    if (this.registry.getConfig().NODE_ENV == 'production') {
      throw new NotImplementedException('API is not supported in production');
    }

    return this.poolMockService.generate(ownerAddress);
  }
}
