import { Controller, Get, Optional, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import {
  ListUserTokenDto,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { PortfolioService } from '../services/portfolio.service';
import { CacheLevel, CacheStorage } from '../../providers/cache.provider';

@Controller('portfolio')
@ApiTags('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('/:ownerAddress/portfolio/sync')
  async syncPortfolio(
    @Param('ownerAddress') ownerAddress: string,
  ): Promise<void> {
    return this.portfolioService.syncUserPortfolio(ownerAddress);
  }
  @Get('/:ownerAddress/user-tokens')
  async listUserTokens(
    @Param('ownerAddress') ownerAddress: string,
    @Optional() @Query() { sortBy, chainId }: ListUserTokenDto,
    @Query() { limit, offset, search }: CommonQueryDto,
  ): Promise<UserTokenWithAdditionView[]> {
    return this.portfolioService.listUserToken(ownerAddress, {
      sortBy,
      chainId,
      limit,
      offset,
      search,
    });
  }

  @Get('/:ownerAddress/pnl')
  async getPortfolioPNL(@Param('ownerAddress') ownerAddress: string) {
    const cachedResult = CacheStorage.get(`getPortfolioPNL-${ownerAddress}`);

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.portfolioService.getPortfolioPNL([ownerAddress]);
    CacheStorage.set(
      `getPortfolioPNL-${ownerAddress}`,
      result,
      CacheLevel.INSTANT,
    );

    return result;
  }
}
