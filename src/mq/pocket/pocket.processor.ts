import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import {
  POOL_QUEUE,
  BUY_TOKEN_PROCESS,
  BuyTokenJobData,
  SYNC_POCKETS,
} from '../dto/pool.queue';

import { PoolService } from '../../pool/services/pool.service';
import { SyncPoolService } from '../../pool/services/sync-pool.service';

@Processor(POOL_QUEUE)
export class PocketProcessor {
  constructor(
    private readonly poolService: PoolService,
    private readonly syncService: SyncPoolService,
  ) {}
  @Process(BUY_TOKEN_PROCESS)
  async buyTokenJob(job: Job<BuyTokenJobData>) {
    try {
      await this.poolService.executeSwapToken(job.data.poolId);
    } catch (e) {
      console.log('ERROR::JOB_FAILED_TO_EXECUTE_BUY_TOKEN', e);
    }
  }

  @Process(SYNC_POCKETS)
  async syncPockets() {
    try {
      await this.syncService.syncPools();
    } catch (e) {
      console.log('ERROR::JOB_FAILED_TO_SYNC_POCKETS', e);
    }
  }
}
