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
            dexUrl: 'https://app.uniswap.org/#/swap',
          },
        ],
      },
      xdc: {
        rpcUrl: registry.getConfig().NETWORKS['xdc'].RPC_URL,
        chainId: registry.getConfig().NETWORKS['xdc'].CHAIN_ID,
        programAddress:
          registry.getConfig().NETWORKS['xdc'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          registry.getConfig().NETWORKS['xdc'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          registry.getConfig().NETWORKS['xdc'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        whitelistedRouters: [
          {
            address: '0xf9c5E4f6E627201aB2d6FB6391239738Cf4bDcf9',
            isV3: false,
            ammTag: 'xspswap',
            dexUrl: 'https://app.xspswap.finance/swap',
          },
        ],
      },
      okt: {
        rpcUrl: registry.getConfig().NETWORKS['okt'].RPC_URL,
        chainId: registry.getConfig().NETWORKS['okt'].CHAIN_ID,
        programAddress:
          registry.getConfig().NETWORKS['okt'].POCKET_PROGRAM_ADDRESS,
        vaultAddress:
          registry.getConfig().NETWORKS['okt'].POCKET_VAULT_PROGRAM_ADDRESS,
        registryAddress:
          registry.getConfig().NETWORKS['okt'].POCKET_REGISTRY_PROGRAM_ADDRESS,
        whitelistedRouters: [
          {
            address: '0xc97b81B8a38b9146010Df85f1Ac714aFE1554343',
            isV3: false,
            ammTag: 'okswap',
            dexUrl: 'https://www.okx.com/oktc/swap/trade',
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
