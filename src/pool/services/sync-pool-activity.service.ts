import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PoolActivityDocument,
  PoolActivityModel,
} from '../../orm/model/pool-activity.model';
import { SolanaPoolProvider } from '../../providers/pool-program/solana-pool.provider';
import { PoolActivityStatus } from '../entities/pool-activity.entity';
import { convertToPoolActivityEntity } from '../oc-dtos/pocket-activity.oc-dto';

@Injectable()
export class SyncPoolActivityService {
  constructor(
    private readonly onChainPoolProvider: SolanaPoolProvider,
    @InjectModel(PoolActivityModel.name)
    private readonly poolActivityRepo: Model<PoolActivityDocument>,
  ) {}

  async syncPoolActivities(poolId: string) {
    const latest = await this.poolActivityRepo.findOne(
      {
        poolId: new Types.ObjectId(poolId),
        status: PoolActivityStatus.SUCCESSFUL,
      },
      undefined,
      {
        sort: { createdAt: -1 },
      },
    );

    const newActivities = await this.onChainPoolProvider.fetchActivities(
      poolId,
      100,
      latest?.transactionId,
    );

    if (newActivities.length == 0) return;

    const mappedActivities = newActivities.map(
      ({ eventName, eventData, transaction, createdAt }) =>
        convertToPoolActivityEntity(
          poolId,
          transaction.signatures[0],
          eventName,
          eventData,
          createdAt,
        ),
    );

    await this.poolActivityRepo.create(mappedActivities);
  }
}
