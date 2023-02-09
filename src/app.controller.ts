import { Controller, Get } from '@nestjs/common';
import { PlatformConfigEntity } from './token-metadata/entities/platform-config.entity';

@Controller()
export class AppController {
  @Get('/platform-config')
  getConfig(): PlatformConfigEntity {
    return {
      maxAllowedOptions: 4,
      maxAllowedItems: 4,
      allowCurrencies: [
        {
          id: 'So11111111111111111111111111111111111111112',
          image:
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
          name: 'Solana',
          type: 'token',
          decimals: 9,
        },
        {
          id: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
          image:
            'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
          name: 'Bonk',
          type: 'token',
          decimals: 5,
        },
        {
          id: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          image:
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
          name: 'USD Coin',
          type: 'token',
          decimals: 6,
        },
      ],
    };
  }
}
