require('console-stamp')(console);

/**
 * @dev Import core modules.
 */
import { NestFactory } from '@nestjs/core';

import { WorkerModule } from './worker.module';

/**
 * @dev Bootstrap function declaration.
 */
async function bootstrap() {
  /**
   * @dev Initialize app
   */
  await NestFactory.createApplicationContext(WorkerModule);
}

bootstrap();
