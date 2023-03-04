import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import {
  POOL_QUEUE,
  BUY_TOKEN_PROCESS,
  BuyTokenJobData,
} from '../../mq/queues/pool.queue';

import { PoolService } from '../services/pool.service';

@Processor(POOL_QUEUE)
export class PoolProcessor {
  constructor(private readonly poolService: PoolService) {}
  @Process(BUY_TOKEN_PROCESS)
  async buyTokenJob(job: Job<BuyTokenJobData>) {
    try {
      await this.poolService.executeSwapToken(job.data.poolId);
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_EXECUTE_BUY_TOKEN', e);
    }
  }
}
