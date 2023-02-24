import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ArrayType } from '../../api-docs/array-type.decorator';
import { ActivityType } from '../entities/pool-activity.entity';

export class FindPoolActivityDto {
  @IsString()
  ownerAddress: string;

  @IsEnum(ActivityType, { each: true })
  @IsOptional()
  @ArrayType()
  statuses?: ActivityType[];

  @IsDate()
  @Type(() => Date)
  timeFrom: Date;

  @IsDate()
  @Type(() => Date)
  timeTo: Date;
}
