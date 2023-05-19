import { IsEnum, IsOptional } from 'class-validator';
import { ArrayType } from '../../api-docs/array-type.decorator';
import { UserTokenEntity } from '../entities/user-token.entity';
import { ChainID } from '../../pool/entities/pool.entity';

export enum ListUserTokenSortOption {
  VALUE_ASC = 'VALUE_ASC',
  VALUE_DESC = 'VALUE_DESC',
}

export class ListUserTokenDto {
  @ArrayType()
  @IsEnum(ListUserTokenSortOption, { each: true })
  @IsOptional()
  sortBy: ListUserTokenSortOption[];

  @IsEnum(ChainID)
  chainId: ChainID;
}

export class UserTokenWithAdditionView extends UserTokenEntity {
  tokenName: string;

  tokenSymbol: string;

  value: number;
}
