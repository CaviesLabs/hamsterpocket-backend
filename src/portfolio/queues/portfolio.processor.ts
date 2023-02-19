import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import {
  PORTFOLIO_QUEUE,
  UpdatePortfolioJobData,
  UPDATE_PORTFOLIO_PROCESS,
} from '../../mq/queues/portfolio.queue';
import { PortfolioService } from '../services/portfolio.service';

@Processor(PORTFOLIO_QUEUE)
export class PoolProcessor {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Process(UPDATE_PORTFOLIO_PROCESS)
  async updatePortfolio(job: Job<UpdatePortfolioJobData>) {
    try {
      await this.portfolioService.updateByOwnerAddress(job.data.ownerAddress);
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_UPDATE_PORTFOLIO', e);
    }
  }
}
