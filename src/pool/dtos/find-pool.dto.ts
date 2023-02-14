import { IsString } from 'class-validator';

export class FindPoolDto {
  @IsString()
  ownerAddress: string;
}
