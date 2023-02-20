import { Injectable } from '@nestjs/common';
import * as Qs from 'querystring';
import { NetworkProvider } from './network.provider';

type Fiat = 'eur' | 'usd' | 'vnd';

type SimplePrice = {
  [key: string]: Record<Fiat, number>;
};

@Injectable()
export class CoinGeckoClient {
  private host = 'https://api.coingecko.com/api';

  constructor(private readonly networkProvider: NetworkProvider) {}

  async getPriceInCurrencies(ids: string[], inCurrencies: Fiat[]) {
    const query = Qs.stringify({
      ids: ids.join(','),
      vs_currencies: inCurrencies.join(','),
    });
    return await this.networkProvider.request<SimplePrice>(
      `${this.host}/v3/simple/price?${query}`,
      { method: 'GET' },
    );
  }
}
