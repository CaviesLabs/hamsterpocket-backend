import {
  Controller,
  Get,
  NotImplementedException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { RegistryProvider } from '../../providers/registry.provider';
import { FindPoolDto } from '../dtos/find-pool.dto';
import { PoolMockService } from '../services/pool-mock.service';
import { PoolService } from '../services/pool.service';

@Controller('pool')
@ApiTags('pool')
export class PoolController {
  constructor(
    private readonly registry: RegistryProvider,
    private readonly poolService: PoolService,
    private readonly poolMockService: PoolMockService,
  ) {}

  @Get()
  find(
    @Query() { search, limit, offset }: CommonQueryDto,
    @Query() { ownerAddress, sortBy }: FindPoolDto,
  ) {
    return this.poolService.find({
      sortBy,
      search,
      limit,
      offset,
      ownerAddress,
    });
  }

  @Post()
  createEmpty() {
    return this.poolService.createEmpty();
  }

  @Post('/mock/generate')
  generateMock(@Query('ownerAddress') ownerAddress: string) {
    if (this.registry.getConfig().NODE_ENV == 'production') {
      throw new NotImplementedException('API is not supported in production');
    }

    return this.poolMockService.generate(ownerAddress);
  }
}
