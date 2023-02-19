import { Controller, Get, NotImplementedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('portfolio')
@ApiTags('portfolio')
export class PortfolioController {
  @Get()
  async getByOwnerAddress() {
    // TODO: implement API
    throw new NotImplementedException();
  }
}
