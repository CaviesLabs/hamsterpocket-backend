import { Controller, Get, Post } from '@nestjs/common';

import { WhitelistService } from '../services/whitelist.service';
import { SyncPriceService } from '../services/sync-price.service';

@Controller('whitelist')
export class WhitelistController {
  constructor(
    private readonly whitelistService: WhitelistService,
    private readonly syncPriceService: SyncPriceService,
  ) {}
  @Get()
  getAll() {
    return this.whitelistService.getAll();
  }

  @Get('/market')
  getMarkets() {
    return this.whitelistService.getMarkets();
  }

  @Post('/market/sync-price')
  syncPrice() {
    return this.syncPriceService.syncAllWhitelistCurrencyPrice();
  }
}
