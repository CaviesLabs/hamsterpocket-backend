require('console-stamp')(console);

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['warn', 'error', 'log']);
}

bootstrap();
