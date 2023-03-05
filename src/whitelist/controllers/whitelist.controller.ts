import { Controller, Get } from '@nestjs/common';

import { WhitelistService } from '../services/whitelist.service';

@Controller('whitelist')
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}
  @Get()
  getAll() {
    return this.whitelistService.getAll();
  }

  @Get('/market')
  getMarkets() {
    return this.whitelistService.getMarkets();
  }
}
