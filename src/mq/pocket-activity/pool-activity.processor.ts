import { Processor, Process } from '@nestjs/bull';

import {
  POOL_ACTIVITY_QUEUE,
  SYNC_POOL_ACTIVITIES,
} from '../dto/pool-activity.queue';
import { SyncPoolActivityService } from '../../pool/services/sync-pool-activity.service';

@Processor(POOL_ACTIVITY_QUEUE)
export class PoolActivityProcessor {
  constructor(
    private readonly syncPoolActivityService: SyncPoolActivityService,
  ) {}

  @Process(SYNC_POOL_ACTIVITIES)
  async syncPoolActivityJob() {
    try {
      await this.syncPoolActivityService.syncAllPoolActivities();
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_SYNC_ACTIVITY', e);
    }
  }
}
