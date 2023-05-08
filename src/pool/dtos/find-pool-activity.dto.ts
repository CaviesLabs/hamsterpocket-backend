import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ArrayType } from '../../api-docs/array-type.decorator';
import { ActivityType } from '../entities/pool-activity.entity';
import { ChainID } from '../entities/pool.entity';

export class FindPoolActivityDto {
  @IsEnum(ChainID)
  chainId: ChainID;

  @IsString()
  ownerAddress: string;

  @IsEnum(ActivityType, { each: true })
  @IsOptional()
  @ArrayType()
  statuses?: ActivityType[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timeFrom?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timeTo?: Date;
}
