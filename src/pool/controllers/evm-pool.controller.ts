import { Controller, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SyncEvmPoolService } from '../services/sync-evm-pool.service';
import { SyncEvmPoolActivityService } from '../services/sync-evm-pool-activity.service';
import { SyncPoolsDto } from '../dtos/sync-pools.dto';

@Controller('pool')
@ApiTags('evm/pool')
export class EVMPoolController {
  constructor(
    private readonly syncEVMPoolService: SyncEvmPoolService,
    private readonly syncEvmPoolActivityService: SyncEvmPoolActivityService,
  ) {}

  @Post('/evm/:id/sync')
  async evmSyncSinglePocket(@Param('id') id: string) {
    await this.syncEVMPoolService.syncPoolById(id);
  }

  @Post('/user/evm/:ownerAddress/sync')
  evmSyncByOwnerAddress(
    @Param('ownerAddress') ownerAddress: string,
    @Query() { chainId }: SyncPoolsDto,
  ) {
    return this.syncEVMPoolService.syncPoolsByOwnerAddress(
      ownerAddress,
      chainId,
    );
  }

  @Post('/evm/activity/sync')
  async evmSyncPoolActivities() {
    await this.syncEvmPoolActivityService.syncAllPoolActivities();
  }

  @Post('/evm/sync')
  async syncAllEVMPools() {
    await this.syncEVMPoolService.syncPools();
  }
}
