import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { PoolModel } from '../../orm/model/pool.model';
import { PoolActivityModel } from '../../orm/model/pool-activity.model';
import { WhitelistModel } from '../../orm/model/whitelist.model';
import { ActivityType } from '../entities/pool-activity.entity';
import { ChainID } from '../entities/pool.entity';

@Injectable()
@Command({ name: 'fix-decimals-event-data' })
export class FixDecimalsEventData extends CommandRunner {
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
    try {
      const eventData = await this.poolActivityModel
        .aggregate([
          {
            $match: {
              $or: [
                { type: ActivityType.DEPOSITED },
                { type: ActivityType.WITHDRAWN },
                { type: ActivityType.SWAPPED },
                { type: ActivityType.CLOSED_POSITION },
              ],
              chainId: ChainID.Solana,
            },
          },
          {
            $lookup: {
              from: 'pools',
              as: 'pools_docs',
              localField: 'poolId',
              foreignField: '_id',
            },
          },
          {
            $lookup: {
              from: 'whitelists',
              as: 'baseToken_docs',
              localField: 'pools_docs.0.baseTokenAddress',
              foreignField: 'address',
            },
          },
          {
            $lookup: {
              from: 'whitelists',
              as: 'targetToken_docs',
              localField: 'pools_docs.0.targetTokenAddress',
              foreignField: 'address',
            },
          },
          {
            $project: {
              _id: 1,
              type: 1,
              baseTokenAmount: 1,
              targetTokenAmount: 1,
              baseTokenDecimalValue: {
                $cond: {
                  if: { $isNumber: ['$baseTokenAmount'] },
                  then: {
                    $add: {
                      $divide: [
                        '$baseTokenAmount',
                        {
                          $pow: [
                            10,
                            {
                              $arrayElemAt: ['$baseToken_docs.decimals', 0],
                            },
                          ],
                        },
                      ],
                    },
                  },
                  else: '$baseTokenAmount',
                },
              },
              targetTokenDecimalValue: {
                $cond: {
                  if: { $isNumber: ['$targetTokenAmount'] },
                  then: {
                    $add: {
                      $divide: [
                        '$targetTokenAmount',
                        {
                          $pow: [
                            10,
                            {
                              $arrayElemAt: ['$targetToken_docs.decimals', 0],
                            },
                          ],
                        },
                      ],
                    },
                  },
                  else: '$targetTokenAmount',
                },
              },
            },
          },
        ])
        .exec();

      await this.poolModel.bulkWrite(
        (eventData as any).map(
          ({ _id, baseTokenDecimalValue, targetTokenDecimalValue }) => {
            return {
              updateOne: {
                filter: { _id: new Types.ObjectId(_id.toString()) },
                update: {
                  $set: {
                    baseTokenAmount: baseTokenDecimalValue,
                    targetTokenAmount: targetTokenDecimalValue,
                  },
                },
                upsert: true,
              },
            };
          },
        ),
      );

      console.log({ eventData });
    } catch (e) {
      console.log(e);
    }
  }
}
