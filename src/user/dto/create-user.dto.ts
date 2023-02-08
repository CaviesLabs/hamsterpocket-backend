/**
 * Import UserAttributes.
 */
import { PickType } from '@nestjs/swagger';
import { IsDate, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, UserEntity, UserGroup } from '../entities/user.entity';

class _CreateUserDto extends PickType(UserEntity, [
  'email',
  'emailVerified',
  'birthday',
  'displayName',
  'avatar',
  'roles',
  'groups',
  'telegram',
  'twitter',
]) {}

/**
 * Declare create user dto
 */
export class CreateUserDto implements _CreateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  emailVerified?: boolean;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsEmail()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsEnum(UserGroup, { each: true })
  groups?: UserGroup[];

  @IsString()
  @IsOptional()
  telegram?: string;

  @IsString()
  @IsOptional()
  twitter?: string;
}
