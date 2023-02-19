import { Controller, Get, NotImplementedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PortfolioService } from '../services/portfolio.service';

@Controller('portfolio')
@ApiTags('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  async getByOwnerAddress() {
    // TODO: implement API
    throw new NotImplementedException();
  }
}
