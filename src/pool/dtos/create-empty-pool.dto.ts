import { IsEnum, IsString } from 'class-validator';
import { ChainID } from '../entities/pool.entity';

export class CreateEmptyPoolDto {
  @IsEnum(ChainID)
  chainId: ChainID;

  @IsString()
  ownerAddress: string;
}
