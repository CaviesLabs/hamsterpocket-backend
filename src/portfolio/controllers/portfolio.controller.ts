import {
  Controller,
  Get,
  Param,
  // Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { CommonQueryDto } from '../../api-docs/dto/common-query.dto';
import { PortfolioView } from '../dtos/get-portfolio.dto';
import {
  // ListUserTokenDto,
  UserTokenWithAdditionView,
} from '../dtos/list-user-token.dto';
import { PortfolioService } from '../services/portfolio.service';

@Controller('portfolio')
@ApiTags('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('/:ownerAddress')
  async getByOwnerAddress(
    @Param('ownerAddress') ownerAddress: string,
  ): Promise<PortfolioView> {
    console.log(ownerAddress);
    // TODO: implement service
    return {
      totalPoolsBalance: 100,
      totalPoolsBalanceValue: 1000,
      topTokens: [
        { symbol: 'BONK', percent: 0.65 },
        { symbol: 'USDC', percent: 0.3 },
      ],
    };
  }

  @Get('/:ownerAddress/user-tokens')
  async listUserTokens(
    @Param('ownerAddress') ownerAddress: string,
    // @Query() { sortBy }: ListUserTokenDto,
    // @Query() { limit, offset, search }: CommonQueryDto,
  ): Promise<UserTokenWithAdditionView[]> {
    return [
      {
        ownerAddress,
        tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        tokenName: 'Bonk',
        tokenSymbol: 'BONK',
        total: 65,
        value: 650,
      },
      {
        ownerAddress,
        tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        tokenName: 'USD Coin',
        tokenSymbol: 'USDC',
        total: 30,
        value: 350,
      },
      {
        ownerAddress,
        tokenAddress: 'So11111111111111111111111111111111111111112',
        tokenName: 'Solana',
        tokenSymbol: 'SOL',
        total: 5,
        value: 50,
      },
    ];

    // return this.portfolioService.listUserToken(ownerAddress, {
    //   sortBy,
    //   limit,
    //   offset,
    //   search,
    // });
  }
}
