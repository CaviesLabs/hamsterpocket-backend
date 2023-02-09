import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';

import {
  TokenMetadataDocument,
  TokenMetadataModel,
} from '../../orm/model/token-metadata.model';
import {
  AccountToken,
  AccountTokenDetail,
  TokenMetadataProvider,
} from '../../providers/token-metadata.provider';
import { TokenMetadataEntity } from '../entities/token-metadata.entity';

@Injectable()
export class TokenMetadataService {
  constructor(
    private readonly tokenMetadataProvider: TokenMetadataProvider,
    @InjectModel(TokenMetadataModel.name)
    private readonly tokenMetadataRepo: Model<TokenMetadataDocument>,
  ) {}

  private async fetchNftMetadata(
    mintAddress: string[],
  ): Promise<TokenMetadataEntity[]> {
    const metadata = await Promise.all(
      mintAddress.map(async (address) => {
        const { data } = await this.tokenMetadataProvider.getNftDetail(address);
        return {
          mintAddress: address,
          metadata: data[0],
          isNft: !!data[0],
        };
      }),
    );

    return metadata;
  }

  public async getNftMetadata(
    mintAddress: string,
    forceUpdate = false,
  ): Promise<TokenMetadataEntity> {
    /** Skip cache if force update */
    if (!forceUpdate) {
      const existedTokenMetadata = await this.tokenMetadataRepo.findOne({
        mintAddress,
        updatedAt: { $gt: DateTime.now().minus({ days: 15 }).toJSDate() },
      });
      if (!!existedTokenMetadata) return existedTokenMetadata;
    }

    const { data } = await this.tokenMetadataProvider.getNftDetail(mintAddress);

    /** Upsert token metadata */
    await this.tokenMetadataRepo.updateOne(
      { mintAddress },
      {
        mintAddress,
        metadata: data[0],
        isNft: true,
      },
      { upsert: true },
    );

    /** Return new data */
    return this.tokenMetadataRepo.findOne({ mintAddress });
  }

  public async listNftMetadata(
    mintAddresses: string[],
    forceUpdate = false,
  ): Promise<TokenMetadataEntity[]> {
    let existedTokenMetadata: TokenMetadataEntity[] = [];

    /** Skip cache if force update */
    if (!forceUpdate) {
      existedTokenMetadata = await this.tokenMetadataRepo.find({
        mintAddress: { $in: mintAddresses },
        updatedAt: { $gt: DateTime.now().minus({ days: 15 }).toJSDate() },
      });
    }

    /** Filter new or too old metadata */
    const wildMintAddresses: string[] = [];
    mintAddresses.forEach((mintAddress) => {
      if (
        !existedTokenMetadata.find(
          (existed) => existed.mintAddress === mintAddress,
        )
      ) {
        wildMintAddresses.push(mintAddress);
      }
    });

    /** Fetch metadata */
    const wildNftMetadata = await this.fetchNftMetadata(wildMintAddresses);

    /** Upsert metadata */
    return await this.tokenMetadataRepo.create(wildNftMetadata);
  }

  public async listNftsByWallet(address: string): Promise<AccountToken[]> {
    /**
     * @dev fetch wallet's tokens
     */
    const tokens = await this.tokenMetadataProvider.listNftV1(address);

    const tokenMetadata = await this.listNftMetadata(
      tokens.data.map(({ tokenAddress }) => tokenAddress),
    );

    /**
     * @dev get corresponding NFTs metadata
     */
    const accountNfts: Array<AccountToken | null> = tokens.data.map(
      ({ tokenAddress }) => {
        const nft = tokenMetadata.find(
          ({ mintAddress }) => mintAddress === tokenAddress,
        );

        if (!nft.isNft) return null;

        const meta = nft.metadata as AccountTokenDetail;
        return {
          nft_address: meta.nft_address,
          nft_name: meta.nft_name,
          nft_symbol: meta.nft_symbol,
          nft_status: 'holding',
          nft_collection_id: meta.nft_collection_id,
          nft_image_uri: meta.nft_image,
        };
      },
    );

    /**
     * @dev return only NFTs
     */
    return accountNfts.filter((nft) => nft != null);
  }

  public async getCurrency(
    mintAddress: string,
    forceUpdate = false,
  ): Promise<TokenMetadataEntity> {
    /** Skip cache if force update */
    if (!forceUpdate) {
      const existedTokenMetadata = await this.tokenMetadataRepo.findOne({
        mintAddress,
        updatedAt: { $gt: DateTime.now().minus({ days: 15 }).toJSDate() },
      });
      if (!!existedTokenMetadata) return existedTokenMetadata;
    }

    /** Fetch metadata */
    const { data } = await this.tokenMetadataProvider.getCurrencyDetail(
      mintAddress,
    );

    /** Upsert metadata */
    await this.tokenMetadataRepo.updateOne(
      { mintAddress },
      {
        mintAddress,
        metadata: data,
        isNft: false,
      },
      { upsert: true },
    );

    /** Return new update */
    return this.tokenMetadataRepo.findOne({ mintAddress });
  }
}
