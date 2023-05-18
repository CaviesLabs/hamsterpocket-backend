import { Controller, Get } from '@nestjs/common';

import { PlatformConfigEntity } from './token-metadata/entities/platform-config.entity';
import { RegistryProvider } from './providers/registry.provider';

@Controller()
export class AppController {
  @Get('/platform-config')
  getConfig(): PlatformConfigEntity {
    return new RegistryProvider().getChains();
  }
}
