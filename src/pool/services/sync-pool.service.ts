import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';

import { PoolDocument, PoolModel } from '../../orm/model/pool.model';
import {
  calculateProgressPercent,
  PoolEntity,
  PoolStatus,
} from '../entities/pool.entity';

@Injectable()
export class SyncPoolService {
  constructor(
    @InjectModel(PoolModel.name)
    private readonly poolRepo: Model<PoolDocument>,
  ) {}

  async fetchFromContract(poolId: string): Promise<PoolEntity> {
    console.log(poolId);

    /**
     * TODO: fetch new pool data
     */
    const pool = plainToInstance(PoolEntity, {});
    calculateProgressPercent.bind(pool)();

    return pool;
  }

  async executeBuyToken(poolId: string) {
    const pool = await this.poolRepo.findById(poolId);
    console.log(pool._id);

    /**
     * TODO: call Contract IDL to execute buy Token
     */
    const syncedPool = await this.fetchFromContract(poolId);
    await this.poolRepo.updateOne({ id: poolId }, syncedPool, { upsert: true });
  }

  async scheduleJob(pool: PoolEntity) {
    console.log(pool._id);
    /**
     * TODO: publish event to BullMQ
     */
  }

  async syncPools() {
    /** Only pick _id and status */
    const poolIds = await this.poolRepo.find({}, { id: 1, status: 1 });
    const syncedPools = await Promise.all(
      poolIds.map(async ({ id, status }) => {
        const syncedPool = await this.fetchFromContract(id);

        /** Publish a job for new pool */
        if (status === PoolStatus.CREATED) {
          this.scheduleJob(syncedPool);
        }

        return plainToInstance(PoolModel, syncedPool);
      }),
    );

    await this.poolRepo.bulkSave(syncedPools);
  }
}
