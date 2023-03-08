import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  PORTFOLIO_QUEUE,
  UpdatePortfolioJobData,
  UPDATE_USER_TOKEN_PROCESS,
} from '../dto/portfolio.queue';
import { PortfolioService } from '../../portfolio/services/portfolio.service';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';

@Processor(PORTFOLIO_QUEUE)
export class PortfolioProcessor {
  constructor(
    private readonly portfolioService: PortfolioService,

    /**
     * @dev Inject models
     */
    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
  ) {}

  @Process(UPDATE_USER_TOKEN_PROCESS)
  async updatePortfolio(job: Job<UpdatePortfolioJobData>) {
    try {
      const { ownerAddress } = job.data;
      console.log(
        `[${UPDATE_USER_TOKEN_PROCESS}] Started updating portfolio balance of`,
        ownerAddress,
      );

      /**
       * @dev Trigger updating balance
       */
      await this.portfolioService.syncUserPortfolio(ownerAddress);

      console.info(
        `[${UPDATE_USER_TOKEN_PROCESS}] Finished updating portfolio balance of`,
        ownerAddress,
      );
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_UPDATE_USER_TOKEN', e);
    }
  }
}
