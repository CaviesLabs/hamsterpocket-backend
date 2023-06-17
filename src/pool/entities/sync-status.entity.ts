import { ChainID } from './pool.entity';

export class SyncStatusEntity {
  chainId: ChainID;
  syncedBlock: number;
  blockDiff: number;
  startingBlock: number;
}
