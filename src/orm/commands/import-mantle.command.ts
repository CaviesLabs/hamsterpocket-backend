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
@Command({ name: 'import-mantle' })
export class ImportMantleCommand extends CommandRunner {
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
      chainId: ChainID.Mantle,
      syncedBlock: 12165390,
      blockDiff: 2000,
      startingBlock: 12165390,
    });

    await this.whitelistModel.create({
      address: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image:
        'https://assets.coingecko.com/coins/images/30983/small/mantle.jpeg?1689416644',
      name: 'Wrapped Mantle',
      symbol: 'WMNT',
      estimatedValue: 0.406489,
      chainId: ChainID.Mantle,
      coingeckoId: 'wrapped-mantle',
      isNativeCoin: true,
    });

    await this.whitelistModel.create({
      address: '0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE',
      decimals: 6,
      entityType: EntityType.TOKEN,
      image:
        'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663',
      name: 'Mantle Bridged USDT',
      symbol: 'USDT',
      estimatedValue: 1,
      chainId: ChainID.Mantle,
      coingeckoId: 'tether',
      isNativeCoin: false,
    });

    await this.whitelistModel.create({
      address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
      decimals: 6,
      entityType: EntityType.TOKEN,
      image:
        'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1695374272',
      name: 'Mantle Bridged USDC',
      symbol: 'USDC',
      estimatedValue: 1,
      chainId: ChainID.Mantle,
      coingeckoId: 'usd-coin',
      isNativeCoin: false,
    });

    await this.whitelistModel.create({
      address: '0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image:
        'https://assets.coingecko.com/coins/images/31013/small/wrapped-eth-mantle-bridge.png?1689742991',
      name: 'Mantle Bridged ETH',
      symbol: 'WETH',
      estimatedValue: 1636.06,
      chainId: ChainID.Mantle,
      coingeckoId: 'wrapped-ether-mantle-bridge',
      isNativeCoin: false,
    });

    await this.whitelistModel.create({
      address: '0x97174506AafcC846A40832719bD8899a588Bd05c',
      decimals: 18,
      entityType: EntityType.TOKEN,
      image: 'https://agni.finance/static/realbenz.png',
      name: 'RealBenZ Token',
      symbol: 'RealBenZ',
      estimatedValue: 0.003316,
      chainId: ChainID.Mantle,
      coingeckoId: null,
      isNativeCoin: false,
    });
  }
}
