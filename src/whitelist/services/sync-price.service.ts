import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BigNumber } from 'ethers';

import {
  WhitelistDocument,
  WhitelistModel,
} from '../../orm/model/whitelist.model';
import { CoinGeckoClient } from '../../providers/coin-gecko.client';
import { Timer } from '../../providers/utils.provider';
import { EVMBasedPocketProvider } from '../../providers/evm-pocket-program/evm.provider';
import { EVMChainConfig } from '../../token-metadata/entities/platform-config.entity';
import { RegistryProvider } from '../../providers/registry.provider';
import { StoppedChains } from '@/pool/entities/pool.entity';

@Injectable()
export class SyncPriceService {
  constructor(
    private readonly coinGeckoClient: CoinGeckoClient,
    @InjectModel(WhitelistModel.name)
    private readonly whiteListRepo: Model<WhitelistDocument>,
  ) {}

  async syncAllWhitelistCurrencyPrice() {
    const timer = new Timer('Sync all whitelist currency price');

    timer.start();
    const whitelists = await this.whiteListRepo.find({
      chainId: {
        $nin: StoppedChains,
      },
    });

    if (whitelists.length == 0) return;

    /** Fetch prices */
    const pricing = await this.coinGeckoClient.getPriceInUSD(
      whitelists.map(({ coingeckoId }) => coingeckoId),
    );

    /** Map prices */
    let syncedTokenPrice = 0;

    for (const whitelist of whitelists) {
      /**
       * @dev Check for condition to sync the price
       */
      if (pricing[whitelist.coingeckoId]) {
        whitelist.estimatedValue = pricing[whitelist.coingeckoId].usd;
        syncedTokenPrice++;
      } else {
        try {
          whitelist.estimatedValue = await this.getPriceFromAMM(
            whitelist.address,
          );
          syncedTokenPrice++;
        } catch {
          console.error(
            `Cannot sync price of token: ${whitelist.symbol}, address: ${whitelist.address}`,
          );
        }
      }
    }

    /** Update DB */
    await this.whiteListRepo.bulkSave(whitelists);
    console.log(
      `Whitelist token synced: ${syncedTokenPrice}/${whitelists.length}`,
    );
    timer.stop();
  }

  async getPriceFromAMM(tokenAddress: string) {
    const baseToken = await this.whiteListRepo.findOne({
      address: tokenAddress,
      chainId: {
        $nin: StoppedChains,
      },
    });

    if (!baseToken) return 0;

    const targetToken = await this.whiteListRepo.findOne({
      chainId: baseToken.chainId,
      isNativeCoin: true,
    });

    if (!targetToken) return 0;

    const evmProvider = new EVMBasedPocketProvider(baseToken.chainId);
    const amountIn = BigNumber.from(
      `0x${(10 ** baseToken.decimals).toString(16)}`,
    );

    let bestFee = BigNumber.from(0);

    const chainConfig = new RegistryProvider().getChains()[
      baseToken.chainId
    ] as EVMChainConfig;
    let router = chainConfig.whitelistedRouters.find((elm) => elm.isV3);

    if (router) {
      bestFee = await evmProvider.getBestFee(
        baseToken.address,
        targetToken.address,
        router.address,
        BigNumber.from(amountIn),
      );
    } else {
      router = chainConfig.whitelistedRouters.find((elm) => !elm.isV3);
    }

    const quote = await new EVMBasedPocketProvider(baseToken.chainId).getQuote(
      baseToken.address,
      targetToken.address,
      router.address,
      amountIn,
      bestFee,
    );

    return (
      (parseFloat(quote.amountOut.toString()) / 10 ** targetToken.decimals) *
      targetToken.estimatedValue
    );
  }
}
