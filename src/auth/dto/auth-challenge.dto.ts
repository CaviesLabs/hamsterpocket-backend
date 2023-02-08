import { IsString } from 'class-validator';

/**
 * Define auth challenge dto.
 */
export class AuthChallengeDto {
  @IsString()
  target: string;
}
