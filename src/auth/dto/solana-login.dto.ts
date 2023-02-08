import { IsNumber, IsString } from 'class-validator';

export class SolanaLoginDto {
  @IsNumber()
  authChallengeId: number;

  @IsString()
  desiredWallet: string;

  /**
   * Base 58 encoded signature
   */
  @IsString()
  signature: string;
}
