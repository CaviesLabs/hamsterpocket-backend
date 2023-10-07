import { Controller, Get } from '@nestjs/common';

import { PlatformConfigEntity } from './token-metadata/entities/platform-config.entity';
import { RegistryProvider } from './providers/registry.provider';
import { ChainID } from '@/pool/entities/pool.entity';
import { Connection } from '@solana/web3.js';
import { AptosClient } from 'aptos';
import { JsonRpcProvider } from '@ethersproject/providers';

@Controller()
export class AppController {
  @Get('/platform-config')
  getConfig(): PlatformConfigEntity {
    return new RegistryProvider().getChains();
  }

  @Get('/platform/ping')
  async ping(): Promise<Record<string, boolean | string>> {
    const chains = new RegistryProvider().getChains();
    const p = await Promise.all(
      Object.keys(chains).map(async (key: ChainID) => {
        const rpc = chains[key].rpcUrl;
        if (key === ChainID.Solana) {
          return {
            [key]: await new Connection(rpc)
              .getLatestBlockhash()
              .then((r) => !!r)
              .catch((e) => e.message),
          };
        }

        if (key === ChainID.AptosMainnet) {
          return {
            [key]: await new AptosClient(rpc)
              .getChainId()
              .then((r) => !!r)
              .catch((e) => e.message),
          };
        }

        return {
          [key]: await new JsonRpcProvider(rpc)
            .getBlockNumber()
            .then((r) => !!r)
            .catch((e) => e.message),
        };
      }),
    );

    return p.reduce((accum, status) => {
      return {
        ...accum,
        ...status,
      };
    }, {} as Record<string, boolean>);
  }
}
