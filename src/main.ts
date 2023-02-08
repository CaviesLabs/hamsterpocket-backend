import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RegistryProvider } from './providers/registry.provider';

const registry = new RegistryProvider();

async function bootstrap() {
  const { NODE_ENV, HOST, PORT } = registry.getConfig();
  /** Initialize the app */
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix('/api');

  /** Apply global pipes */
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /** Enable versioning */
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  /** Enable CORS */
  if (NODE_ENV === 'production') {
    app.enableCors({
      allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Origin',
        'Referer',
        'X-Requested-With',
        'Accept',
        'Content-Type',
        'Authorization',
        'Cache-Control',
      ],
      preflightContinue: true,
      credentials: true,
      methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE', 'PATCH'],
    });
  }

  /** Set-up Swagger docs */
  const config = new DocumentBuilder().setTitle('Beersup API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  /** Start the server */
  await app.listen(PORT, HOST);
}
bootstrap();
