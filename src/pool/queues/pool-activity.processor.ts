import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {
  POOL_ACTIVITY_QUEUE,
  SyncPoolActivityJobData,
  SYNC_POOL_ACTIVITY,
} from '../../mq/queues/pool-activity.queue';
import { SyncPoolActivityService } from '../services/sync-pool-activity.service';

@Processor(POOL_ACTIVITY_QUEUE)
export class PoolActivityProcessor {
  constructor(
    private readonly syncPoolActivityService: SyncPoolActivityService,
  ) {}
  @Process(SYNC_POOL_ACTIVITY)
  async syncPoolActivityJob(job: Job<SyncPoolActivityJobData>) {
    try {
      await this.syncPoolActivityService.syncPoolActivities(job.data.poolId);
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_SYNC_ACTIVITY', e);
    }
  }
}
