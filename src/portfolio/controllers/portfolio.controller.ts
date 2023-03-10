import { Controller, Get, Optional, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
// import { PortfolioView } from '../dtos/get-portfolio.dto';
import {
  ListUserTokenDto,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { PortfolioService } from '../services/portfolio.service';

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
  //
  // @Get('/:ownerAddress/base-token/:tokenAddress')
  // async getByOwnerAddress(
  //   @Param('ownerAddress') ownerAddress: string,
  //   @Param('tokenAddress') tokenAddress: string,
  // ): Promise<PortfolioView> {
  //   return this.portfolioService.getBalance(ownerAddress, tokenAddress);
  // }

  @Get('/:ownerAddress/user-tokens')
  async listUserTokens(
    @Param('ownerAddress') ownerAddress: string,
    @Optional() @Query() { sortBy }: ListUserTokenDto,
    @Query() { limit, offset, search }: CommonQueryDto,
  ): Promise<UserTokenWithAdditionView[]> {
    return this.portfolioService.listUserToken(ownerAddress, {
      sortBy,
      limit,
      offset,
      search,
    });
  }
}
