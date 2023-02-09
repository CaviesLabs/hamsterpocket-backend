import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokenMetadataProvider } from '../../providers/token-metadata.provider';
import { TokenMetadataService } from '../services/token-metadata.service';

@Controller('metadata')
@ApiTags('metadata')
export class MetadataController {
  constructor(
    private readonly tokenMetadataProvider: TokenMetadataProvider,
    private readonly tokenMetadataService: TokenMetadataService,
  ) {}

  @Get('/nft/portfolio')
  listNft(@Query('walletAddress') walletAddress: string) {
    return this.tokenMetadataProvider.listNft(walletAddress);
  }

  @Get('/nft/v1/portfolio')
  listNftV1(@Query('walletAddress') walletAddress: string) {
    return this.tokenMetadataService.listNftsByWallet(walletAddress);
  }

  @Get('/nft/detail/:mintAddress')
  async getNftDetail(@Param('mintAddress') mintAddress: string) {
    const { metadata } = await this.tokenMetadataService.getNftMetadata(
      mintAddress,
    );
    return {
      data: [metadata],
    };
  }

  @Get('/token/:mintAddress')
  async getToken(@Param('mintAddress') mintAddress: string) {
    const { metadata } = await this.tokenMetadataService.getCurrency(
      mintAddress,
    );

    return { data: metadata };
  }

  @Get('/token/portfolio')
  listToken(@Query('walletAddress') walletAddress: string) {
    return this.tokenMetadataProvider.listConcurrency(walletAddress);
  }

  @Get('/collection/:collectionId')
  getCollectionById(@Param('collectionId') collectionId: string) {
    return this.tokenMetadataProvider.getCollection(collectionId);
  }
}
