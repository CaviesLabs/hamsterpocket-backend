import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';

import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/Pick';
import { streamValues } from 'stream-json/streamers/StreamValues';

import { MarketModel } from '../../orm/model/market.model';
import { MarketEntity } from '../entities/market.entity';

interface BasicCommandOptions {
  path: string;
}

@Injectable()
@Command({ name: 'seeding-market' })
export class MarketSeedingCommand extends CommandRunner {
  constructor(
    @InjectModel(MarketModel.name)
    private readonly marketDataRepo: Model<MarketModel>,
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
    options?: BasicCommandOptions,
  ): Promise<void> {
    // Raise error if not matched
    if (!options.path) {
      throw new Error('JSON_PATH_NOT_SPECIFIED');
    }

    await this.marketDataRepo.base.connection.getClient().connect();
    // now process data
    await this.process(options.path);

    // End
    return;
  }

  private async process(path: string): Promise<void> {
    const pipeline = chain([
      fs.createReadStream(path, { flags: 'r', encoding: 'utf-8' }),
      parser(),
      pick({ filter: 'official' }),
      streamValues(),
      async (data) => {
        /**
         * @dev Parsed data
         */
        const marketData = data.value as MarketEntity[];

        /**
         * @dev Filtered data
         */
        const requiredData = marketData.filter((market) => {
          return (
            market.marketProgramId ===
              'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX' &&
            (market.quoteMint ===
              'So11111111111111111111111111111111111111112' ||
              market.baseMint === 'So11111111111111111111111111111111111111112')
          );
        });

        return requiredData.map((data) => plainToInstance(MarketEntity, data));
      },
    ]);

    pipeline.on('data', async (data) => {
      /**
       * @dev Bulk create
       */
      await this.marketDataRepo.create(data, {});
    });
    pipeline.on('end', () => {
      console.log('Inserted successfully');
    });
  }
}
