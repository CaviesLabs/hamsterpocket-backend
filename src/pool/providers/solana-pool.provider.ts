import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { calculateProgressPercent, PoolEntity } from '../entities/pool.entity';

@Injectable()
export class SolanaPoolProvider {
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
    console.log(poolId);

    /**
     * TODO: call Contract IDL to execute buy Token
     */
  }
}
