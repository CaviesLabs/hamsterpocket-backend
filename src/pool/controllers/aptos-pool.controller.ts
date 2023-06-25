import { Controller, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SyncPoolsDto } from '../dtos/sync-pools.dto';
import { SyncAptosPoolService } from '@/pool/services/sync-aptos-pool.service';
import { SyncAptosActivityService } from '@/pool/services/sync-aptos-activity.service';

@Controller('pool')
@ApiTags('aptos/pool')
export class AptosPoolController {
  constructor(
    private readonly syncPoolService: SyncAptosPoolService,
    private readonly syncPoolActivityService: SyncAptosActivityService,
  ) {}

  @Post('/aptos/:id/sync')
  async syncSinglePocket(@Param('id') id: string) {
    await this.syncPoolService.syncPoolById(id);
  }

  @Post('/user/aptos/:ownerAddress/sync')
  syncByOwnerAddress(
    @Param('ownerAddress') ownerAddress: string,
    @Query() { chainId }: SyncPoolsDto,
  ) {
    return this.syncPoolService.syncPoolsByOwnerAddress(ownerAddress, chainId);
  }

  @Post('/aptos/activity/sync')
  async syncPoolActivities() {
    await this.syncPoolActivityService.syncAllPoolActivities();
  }

  @Post('/aptos/sync')
  async syncAllPools() {
    await this.syncPoolService.syncPools();
  }
}
