import { Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WhitelistDocument, WhitelistModel } from '@/orm/model/whitelist.model';
import {
  SyncStatusDocument,
  SyncStatusModel,
} from '@/orm/model/sync-status.model';
import { ChainID } from '@/pool/entities/pool.entity';
import { EntityType } from '@/whitelist/entities/whitelist.entity';

@Injectable()
@Command({ name: 'import-scroll' })
export class ImportScrollCommand extends CommandRunner {
  constructor(
    @InjectModel(WhitelistModel.name)
    private readonly whitelistModel: Model<WhitelistDocument>,

    @InjectModel(SyncStatusModel.name)
    private readonly syncStatus: Model<SyncStatusDocument>,
  ) {
    super();
  }

  public async run(): Promise<void> {
    return await this.process();
  }

  private async process(): Promise<void> {
    // create sync status for mantle
    await this.syncStatus.create({
      chainId: ChainID.ScrollSepolia,
      syncedBlock: 1356865,
      blockDiff: 2000,
      startingBlock: 1356865,
    });

    await this.whitelistModel.create({
      address: '0x5300000000000000000000000000000000000004',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image:
        'https://assets.coingecko.com/coins/images/2518/small/weth.png?1696503332',
      name: 'Wrapped ETH',
      symbol: 'WETH',
      estimatedValue: 1636.06,
      chainId: ChainID.ScrollSepolia,
      coingeckoId: 'weth',
      isNativeCoin: true,
    });

    await this.whitelistModel.create({
      address: '0xD9692f1748aFEe00FACE2da35242417dd05a8615',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image:
        'https://raw.githubusercontent.com/scroll-tech/uniswap-v3-interface/scroll-sepolia-showcase/blockchains/ethereum/assets/0xD9692f1748aFEe00FACE2da35242417dd05a8615/logo.png',
      name: 'Gho Token',
      symbol: 'GHO',
      estimatedValue: 1,
      chainId: ChainID.ScrollSepolia,
      coingeckoId: null,
      isNativeCoin: false,
    });

    await this.whitelistModel.create({
      address: '0x9c53Fc766dC0447dd15B48647e83Ca8621Ae3493',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image: null,
      name: 'BOX Token',
      symbol: 'BOX',
      estimatedValue: 1,
      chainId: ChainID.ScrollSepolia,
      coingeckoId: null,
      isNativeCoin: false,
    });

    await this.whitelistModel.create({
      address: '0x5868B5394DEcbE28185879Cd6E63Ab7560FFf2D8',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image: null,
      name: 'Pocket Token',
      symbol: 'POCKET',
      estimatedValue: 1,
      chainId: ChainID.ScrollSepolia,
      coingeckoId: null,
      isNativeCoin: false,
    });
  }
}
