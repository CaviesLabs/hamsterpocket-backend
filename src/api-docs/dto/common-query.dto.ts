import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * @dev DTO for common query params
 */
export class CommonQueryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0;

  @IsString()
  @IsOptional()
  search?: string;
}
