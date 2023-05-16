import { Controller, Get } from '@nestjs/common';

import { PlatformConfigEntity } from './token-metadata/entities/platform-config.entity';
import { RegistryProvider } from './providers/registry.provider';

@Controller()
export class AppController {
  @Get('/platform-config')
  getConfig(): PlatformConfigEntity {
    const registry = new RegistryProvider();

    return {
      bnb: {
        rpcUrl: registry.getConfig().NETWORKS['bnb'].RPC_URL,
        chainId: registry.getConfig().NETWORKS['bnb'].CHAIN_ID,
        programAddress:
          registry.getConfig().NETWORKS['bnb'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          registry.getConfig().NETWORKS['bnb'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          registry.getConfig().NETWORKS['bnb'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        whitelistedRouters: [
          {
            address: '0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897',
            isV3: true,
            ammTag: 'uniswap',
            dexUrl: 'https://app.uniswap.org/#/swap/',
          },
          {
            address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
            isV3: false,
            ammTag: 'pancakeswap',
            dexUrl: 'https://pancakeswap.finance/swap/',
          },
        ],
      },
      polygon_mumbai: {
        rpcUrl: registry.getConfig().NETWORKS['polygon_mumbai'].RPC_URL,
        chainId: registry.getConfig().NETWORKS['polygon_mumbai'].CHAIN_ID,
        programAddress:
          registry.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          registry.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          registry.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_REGISTRY_PROGRAM_ADDRESS,
        whitelistedRouters: [
          {
            address: '0x4648a43B2C14Da09FdF82B161150d3F634f40491',
            isV3: true,
            ammTag: 'uniswap',
            dexUrl: 'https://app.uniswap.org/#/swap/',
          },
        ],
      },
      solana: {
        rpcUrl: registry.getConfig().NETWORKS['solana'].RPC_URL,
        programAddress:
          registry.getConfig().NETWORKS['solana'].POCKET_PROGRAM_ADDRESS,
        mainDex: 'https://raydium.io/swap/',
      },
    };
  }
}
