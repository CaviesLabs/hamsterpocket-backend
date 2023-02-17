import { IsEnum, IsString } from 'class-validator';

export enum FindPoolSortOption {
  DATE_START_DESC = 'DATE_START_DESC',
  DATE_CREATED_DESC = 'DATE_CREATED_DESC',
  PROGRESS_ASC = 'PROGRESS_ASC',
  PROGRESS_DESC = 'PROGRESS_DESC',
}

export class FindPoolDto {
  @IsString()
  ownerAddress: string;

  @IsEnum(FindPoolSortOption)
  sortBy: FindPoolSortOption = FindPoolSortOption.DATE_START_DESC;
}
