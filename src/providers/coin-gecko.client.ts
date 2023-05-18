import { Injectable } from '@nestjs/common';
import * as Qs from 'querystring';
import { NetworkProvider } from './network.provider';

type Fiat = 'eur' | 'usd' | 'vnd';

type SimplePrice = {
  [mintAddress: string]: Record<Fiat, number>;
};

@Injectable()
export class CoinGeckoClient {
  private host = 'https://api.coingecko.com/api';

  constructor(private readonly networkProvider: NetworkProvider) {}

  async getPriceInCurrencies(
    mintAddresses: string[],
    fiats: Fiat[],
    platform = 'solana',
  ) {
    const query = Qs.stringify({
      contract_addresses: mintAddresses.join(','),
      vs_currencies: fiats.join(','),
    });
    return this.networkProvider.request<SimplePrice>(
      `${this.host}/v3/simple/token_price/${platform}?${query}`,
      { method: 'GET' },
    );
  }
  async getPriceInUSD(ids: string[]) {
    const query = Qs.stringify({
      ids: ids.join(','),
      vs_currencies: 'usd',
    });
    return this.networkProvider.request<SimplePrice>(
      `${this.host}/v3/simple/price?${query}`,
      { method: 'GET' },
    );
  }
}
