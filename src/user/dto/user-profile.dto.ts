import { PickType } from '@nestjs/swagger';
import { ArrayType } from '../../api-docs/array-type.decorator';
import { UserEntity } from '../entities/user.entity';

export class UserProfileDto extends UserEntity {
  walletAddress: string;
}

export class UserPublicProfileDto extends PickType(UserEntity, ['id', 'avatar', 'telegram', 'twitter']) {
  walletAddress: string;

  ordersStat: UserOrderStatDto;
}

export class UserOrderStatDto {
  orders: number;

  completedOrders: number;
}

export class GetUsersPublicProfileDto {
  @ArrayType()
  ids: string[];
}
