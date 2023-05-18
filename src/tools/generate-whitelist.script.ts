import * as fs from 'fs';

import { NetworkProvider } from '../providers/network.provider';
import { TokenMetadataProvider } from '../providers/token-metadata.provider';
import {
  EntityType,
  WhitelistEntity,
} from '../whitelist/entities/whitelist.entity';
import { ChainID } from '../pool/entities/pool.entity';

const mintAddresses = [
  'So11111111111111111111111111111111111111112',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
];

async function generateWhitelist() {
  const metadataProvider = new TokenMetadataProvider(new NetworkProvider());
  const whitelist: Omit<WhitelistEntity, 'id'>[] = [];
  for (const address of mintAddresses) {
    const {
      data: { name, symbol, decimals, icon },
    } = await metadataProvider.getCurrencyDetail(address);
    whitelist.push({
      coingeckoId: null,
      isNativeCoin: false,
      chainId: ChainID.Solana,
      entityType: EntityType.TOKEN,
      address,
      name,
      symbol,
      decimals,
      image: icon,
    });
  }

  fs.writeFileSync(
    './src/assets/raydium.whitelist.json',
    JSON.stringify(whitelist),
  );
}

generateWhitelist();
