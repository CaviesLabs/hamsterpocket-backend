import { IsEnum } from 'class-validator';
import { ChainID } from '../entities/pool.entity';

export class SyncPoolsDto {
  @IsEnum(ChainID)
  chainId: ChainID;
}
