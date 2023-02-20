import {
  EntityType,
  WhitelistEntity,
} from '../whitelist/entities/whitelist.entity';

export const defaultWhitelists: Omit<WhitelistEntity, 'id'>[] = [
  {
    coinGeckoId: 'solana',
    entityType: EntityType.TOKEN,
    address: 'So11111111111111111111111111111111111111112',
    name: 'Solana',
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    decimals: 9,
    symbol: 'SOL',
  },
  {
    coinGeckoId: 'bonk',
    entityType: EntityType.TOKEN,
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    name: 'Bonk',
    image: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    decimals: 5,
    symbol: 'BONK',
  },
  {
    coinGeckoId: 'usd-coin',
    entityType: EntityType.TOKEN,
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USD Coin',
    image:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    decimals: 6,
    symbol: 'USDC',
  },
];
