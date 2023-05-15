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
        mainDex: 'https://app.uniswap.org/#/swap/',
        vaultAddress:
          registry.getConfig().NETWORKS['bnb'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          registry.getConfig().NETWORKS['bnb'].POCKET_REGISTRY_PROGRAM_ADDRESS,
      },
      polygon_mumbai: {
        rpcUrl: registry.getConfig().NETWORKS['polygon_mumbai'].RPC_URL,
        chainId: registry.getConfig().NETWORKS['polygon_mumbai'].CHAIN_ID,
        programAddress:
          registry.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_PROGRAM_ADDRESS,
        mainDex: 'https://app.uniswap.org/#/swap/',
        vaultAddress:
          registry.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          registry.getConfig().NETWORKS['polygon_mumbai']
            .POCKET_REGISTRY_PROGRAM_ADDRESS,
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
