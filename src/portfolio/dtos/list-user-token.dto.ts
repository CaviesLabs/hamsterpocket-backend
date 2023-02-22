import { UserTokenEntity } from '../entities/user-token.entity';

export enum ListUserTokenSortOption {
  VALUE_ASC = 'VALUE_ASC',
  VALUE_DESC = 'VALUE_DESC',
}

export class ListUserTokenDto {
  sortBy: ListUserTokenSortOption[];
}

export class UserTokenWithAdditionView extends UserTokenEntity {
  tokenName: string;

  tokenSymbol: string;

  value: number;
}
