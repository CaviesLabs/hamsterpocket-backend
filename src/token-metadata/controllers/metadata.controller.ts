import { BigNumber } from 'ethers';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TokenMetadataProvider } from '../../providers/token-metadata.provider';
import { TokenMetadataService } from '../services/token-metadata.service';
import { ChainID } from '../../pool/entities/pool.entity';
import { EVMBasedPocketProvider } from '../../providers/evm-pocket-program/evm.provider';
import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';

@Controller('metadata')
@ApiTags('metadata')
export class MetadataController {
  constructor(
    private readonly tokenMetadataProvider: TokenMetadataProvider,
    private readonly tokenMetadataService: TokenMetadataService,
    @InjectModel(WhitelistModel.name)
    private readonly whitelistRepo: Model<WhitelistDocument>,
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
  @Get('/market/quote/')
  public async getQuotes(
    @Query('chainId') chainId: ChainID,
    @Query('baseTokenAddress') baseTokenAddress: string,
    @Query('targetTokenAddress') targetTokenAddress: string,
    @Query('ammRouterAddress') ammRouterAddress: string,
    @Query('amountIn') amount: string,
    @Query('useV3') useV3: boolean,
  ) {
    // const baseToken = await this.whitelistRepo.findOne({
    //   address: baseTokenAddress,
    // });
    // const targetToken = await this.whitelistRepo.findOne({
    //   address: targetTokenAddress,
    // });

    const evmProvider = new EVMBasedPocketProvider(chainId);
    // const amountIn = BigNumber.from(
    //   `0x${(parseFloat(amount) * 10 ** baseToken.decimals).toString(16)}`,
    // );
    const amountIn = BigNumber.from(`0x${amount}`);

    let bestFee = BigNumber.from(0);
    if (useV3) {
      bestFee = await evmProvider.getBestFee(
        baseTokenAddress,
        targetTokenAddress,
        ammRouterAddress,
        BigNumber.from(amountIn),
      );
    }

    const quote = await new EVMBasedPocketProvider(chainId).getQuote(
      baseTokenAddress,
      targetTokenAddress,
      ammRouterAddress,
      amountIn,
      bestFee,
    );

    return {
      amountIn: quote.amountIn.toString(),
      amountOut: quote.amountOut.toString(),
      fee: bestFee.toString(),
    };
  }
}
