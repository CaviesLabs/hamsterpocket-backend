import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  PoolActivityModel,
  PoolActivitySchema,
} from './model/pool-activity.model';
import { PoolModel, PoolSchema } from './model/pool.model';
import {
  TokenMetadataModel,
  TokenMetadataSchema,
} from './model/token-metadata.model';
import { UserTokenModel, UserTokenSchema } from './model/user-token.model';
import { WhitelistModel, WhitelistSchema } from './model/whitelist.model';
import { MarketDataSchema, MarketModel } from './model/market.model';
import { StatisticsModel, StatisticsSchema } from './model/statistic.model';

@Module({
  /**
   * @dev Declare models for the system to inject.
   */
  imports: [
    /**
     * @dev Use forFeature to declare models.
     */
    MongooseModule.forFeature([
      { name: TokenMetadataModel.name, schema: TokenMetadataSchema },
      { name: WhitelistModel.name, schema: WhitelistSchema },
      { name: PoolModel.name, schema: PoolSchema },
      { name: PoolActivityModel.name, schema: PoolActivitySchema },
      { name: UserTokenModel.name, schema: UserTokenSchema },
      { name: MarketModel.name, schema: MarketDataSchema },
      { name: StatisticsModel.name, schema: StatisticsSchema },
    ]),
  ],
  exports: [
    /**
     * @dev Need to re-export again the Mongoose module for re-use in other modules.
     */
    MongooseModule,
  ],
})
export class OrmModule {}
