import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamValues } from 'stream-json/streamers/StreamValues';

import { WhitelistEntity } from '../entities/whitelist.entity';
import { WhitelistModel } from '../../orm/model/whitelist.model';
import { SyncPriceService } from '../services/sync-price.service';

interface CommandOptions {
  path: string;
}

@Injectable()
@Command({ name: 'price-feed-sync' })
export class PriceFeedSyncCommand extends CommandRunner {
  constructor(
    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistModel>,

    private readonly syncService: SyncPriceService,
  ) {
    super();
  }

  @Option({
    flags: '-p, --path [number]',
    description: 'Path to json market data',
  })
  public parseMarketJsonPath(val: string): string {
    return val;
  }

  public async run(
    passedParams: string[],
    options?: CommandOptions,
  ): Promise<void> {
    // Raise error if not matched
    if (!options.path) {
      throw new Error('JSON_PATH_NOT_SPECIFIED');
    }

    // now process data
    await this.process(options.path);

    // End
    return;
  }

  private async process(path: string): Promise<void> {
    const pipeline = chain([
      fs.createReadStream(path, { flags: 'r', encoding: 'utf-8' }),
      parser(),
      streamValues(),
      async (data) => {
        /**
         * @dev Parsed data
         */
        return data.value as WhitelistEntity[];
      },
    ]);

    pipeline.on('data', async (data) => {
      /** Upsert every deployed */
      await this.whitelistRepo.bulkWrite(
        [data].map((data) => ({
          updateOne: {
            filter: { address: data.address },
            update: data,
            upsert: true,
          },
        })),
      );

      /** trigger sync prices */
      await this.syncService.syncAllWhitelistCurrencyPrice();
    });
    pipeline.on('end', () => {
      console.log('Inserted successfully');
    });
  }
}
