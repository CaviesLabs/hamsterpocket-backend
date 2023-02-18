import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import { PoolService } from '../services/pool.service';

export const POOL_QUEUE = 'pool';

export type BuyTokenJobData = string;

@Processor(POOL_QUEUE)
export class PoolProcessor {
  constructor(private readonly poolService: PoolService) {}
  @Process('buy-token')
  async buyTokenJob(job: Job<BuyTokenJobData>) {
    try {
      await this.poolService.executeBuyToken(job.data);
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_EXECUTE_BUY_TOKEN', e);
    }
  }
}
