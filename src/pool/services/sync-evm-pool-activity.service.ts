import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';
import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import { Timer } from '../../providers/utils.provider';
import { ChainID } from '../entities/pool.entity';
import { EVMPocketConverter } from '../../providers/evm-pocket-program/evm.converter';

@Injectable()
export class SyncEvmPoolActivityService {
  constructor(
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async syncAllPoolActivities() {
    const timer = new Timer('Sync All EVM Pools activities');
    timer.start();

    const data = await this.poolRepo.aggregate([
      {
        $match: {
          chainId: {
            $ne: ChainID.Solana,
          },
        },
      },
      {
        $group: {
          _id: '$chainId',
          idList: {
            $push: '$_id',
          },
        },
      },
    ]);

    await Promise.all(
      data.map(async ({ _id: chainId }) => {
        const events = await new EVMPocketConverter(chainId).fetchEventEntities(
          35329403,
        );
        console.log({ events });
      }),
    );

    timer.stop();
  }
}
