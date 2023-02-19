import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import {
  PORTFOLIO_QUEUE,
  UpdatePortfolioJobData,
  UPDATE_USER_TOKEN_PROCESS,
} from '../../mq/queues/portfolio.queue';
import { PortfolioService } from '../services/portfolio.service';

@Processor(PORTFOLIO_QUEUE)
export class PortfolioProcessor {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Process(UPDATE_USER_TOKEN_PROCESS)
  async updatePortfolio(job: Job<UpdatePortfolioJobData>) {
    try {
      const { ownerAddress, tokenAddress } = job.data;
      await this.portfolioService.updateUserToken(ownerAddress, tokenAddress);
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_UPDATE_USER_TOKEN', e);
    }
  }
}
