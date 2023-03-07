import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  PORTFOLIO_QUEUE,
  UpdatePortfolioJobData,
  UPDATE_USER_TOKEN_PROCESS,
} from '../../mq/queues/portfolio.queue';
import { PortfolioService } from '../services/portfolio.service';
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
      console.log('Started updating portfolio balance of', ownerAddress);

      /**
       * @dev Trigger updating balance
       */
      const whitelistTokens = await this.whitelistRepo.find().exec();
      await Promise.all(
        whitelistTokens.map((token) =>
          this.portfolioService.updateUserToken(ownerAddress, token.address),
        ),
      );
    } catch (e) {
      console.error('ERROR::JOB_FAILED_TO_UPDATE_USER_TOKEN', e);
    }
  }
}
