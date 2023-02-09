import { Injectable } from '@nestjs/common';
import { NetworkProvider } from './network.provider';
import { RegistryProvider } from './registry.provider';

export interface AccountV1Token {
  owner: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

export interface AccountToken {
  nft_address: string;
  nft_name: string;
  nft_symbol: string;
  nft_status: string;
  nft_collection_id: string;
  nft_image_uri: string;
}

export interface AccountTokenDetail {
  nft_address: string;
  nft_name: string;
  nft_symbol: string;
  nft_image: string;
  nft_collection_id: string;
  nft_collection_name: string;
  nft_attributes: any;
}

export interface CurrencyData {
  symbol: string;
  address: string;
  name: string;
  icon: string;
  website: string;
  twitter: string;
  decimals: number;
  coingeckoId: string;
  holder: number;
}

@Injectable()
export class TokenMetadataProvider {
  constructor(private readonly networkProvider: NetworkProvider) {}

  listNft(address: string) {
    return this.networkProvider.request<{
      data: { list_nft: AccountToken[] };
    }>(`https://pro-api.solscan.io/v1.0/nft/wallet/list_nft/${address}`, {
      method: 'GET',
      headers: {
        token: new RegistryProvider().getConfig().SOLSCAN_API_KEY,
      },
    });
  }

  listNftV1(address: string) {
    return this.networkProvider.request<{ data: AccountV1Token[] }>(
      `https://api.solscan.io/account/v2/tokens?address=${address}`,
      {
        method: 'GET',
      },
    );
  }

  getNftDetail(token: string) {
    return this.networkProvider.request<{ data: AccountTokenDetail[] }>(
      `https://pro-api.solscan.io/v1.0/nft/token/info/${token}`,
      {
        method: 'GET',
        headers: {
          token: new RegistryProvider().getConfig().SOLSCAN_API_KEY,
        },
      },
    );
  }

  async getNftDetailV2(token: string): Promise<{ data: AccountTokenDetail[] }> {
    const {
      data: {
        mint: nft_address,
        collection: nft_collection_name,
        collectionId: nft_collection_id,
      },
    } = await this.networkProvider.request<any>(
      `https://api.solscan.io/nft/detail?mint=${token}`,
      {
        method: 'GET',
      },
    );
    const {
      data: {
        metadata: {
          data: { uri },
        },
      },
    } = await this.networkProvider.request<any>(
      `https://api.solscan.io/account?address=${token}`,
      {
        method: 'GET',
      },
    );

    const nft_attributes = await this.networkProvider.request<any>(uri, {
      method: 'GET',
    });

    const {
      name: nft_name,
      symbol: nft_symbol,
      image: nft_image,
    } = nft_attributes;

    return {
      data: [
        {
          nft_address,
          nft_name,
          nft_symbol,
          nft_collection_id,
          nft_collection_name,
          nft_image,
          nft_attributes,
        },
      ],
    };
  }

  listConcurrency(address: string) {
    return this.networkProvider.request(
      `https://api.solscan.io/account/v2/tokens?address=${address}`,
      {
        method: 'GET',
      },
    );
  }

  getCurrencyDetail(token: string) {
    return this.networkProvider.request<{ data: CurrencyData }>(
      `https://api.solscan.io/token/meta?token=${token}`,
      {
        method: 'GET',
      },
    );
  }

  getCollection(collectionId: string) {
    return this.networkProvider.request<{ data: object }>(
      `https://api.solscan.io/collection/id?collectionId=${collectionId}`,
      {
        method: 'GET',
      },
    );
  }
}
