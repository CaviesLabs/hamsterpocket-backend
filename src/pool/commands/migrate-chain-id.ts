import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { PoolModel } from '../../orm/model/pool.model';
import { PoolActivityModel } from '../../orm/model/pool-activity.model';
import { ChainID } from '../entities/pool.entity';
import { WhitelistModel } from '../../orm/model/whitelist.model';

@Injectable()
@Command({ name: 'migrate-chain-id' })
export class MigrateChainIdCommand extends CommandRunner {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolModel: Model<PoolModel>,

    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityModel: Model<PoolActivityModel>,

    @InjectModel(WhitelistModel.name)
    private readonly whitelistModel: Model<WhitelistModel>,
  ) {
    super();
  }

  public async run(): Promise<void> {
    // now process data
    await this.process();

    // End
    return;
  }

  private async process(): Promise<void> {
    /**
     * @dev Update chain id
     */
    await this.poolModel.updateMany(
      {},
      {
        $set: {
          chainId: ChainID.Solana,
        },
      },
    );

    await this.poolActivityModel.updateMany(
      {},
      {
        $set: {
          chainId: ChainID.Solana,
        },
      },
    );

    await this.whitelistModel.updateMany(
      {},
      {
        $set: {
          chainId: ChainID.Solana,
        },
      },
    );
  }
}
