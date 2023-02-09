/**
 * @dev Import core modules.
 */
import { NestFactory } from '@nestjs/core';
import { ForbiddenException, ValidationPipe } from '@nestjs/common';

/**
 * @dev Import utility libraries.
 */
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { contentParser } from 'fastify-multer';
import helmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

/**
 * @dev import App dependencies.
 */
import { AppModule } from './app.module';
import { RegistryProvider } from './providers/registry.provider';

/**
 * @dev Initialize Registry provider.
 */
const registry = new RegistryProvider();

/**
 * @dev Declare App builder.
 * @param module
 * @param adapter
 */
const createMainAppHandler = async (module, adapter) => {
  return NestFactory.create<NestFastifyApplication>(module, adapter);
};

/**
 * @dev Declare global apply handler.
 * @param app
 */
export const globalApply = async (app) => {
  /**
   * @dev Inject pipes
   */
  app.setGlobalPrefix('api/');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /**
   * @dev Apply non-test environments preferences.
   *
   */
  if (registry.getConfig().NODE_ENV !== 'test') {
    /**
     * @dev Enable helmet security layer.
     */
    app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    });

    /**
     * @dev Enable Fastify-based cookie handler
     */
    await app.register(fastifyCookie, {
      secret: registry.getConfig().SECRET_TOKEN, // for cookies signature
    });

    /**
     * @dev Enable multer file parser.
     */
    app.register(contentParser);
  }
};

/**
 * @dev Declare CORS policy handler.
 * @param adapter
 */
const applyCORSPolicy = (adapter: FastifyAdapter) => {
  /**
   * @dev Define allowed origins.
   */
  const allowedOrigins = [
    /(localhost|ngrok|127\.0\.0\.1)/g, // this is for local development
    /hamsterbox\.xyz$/, // main domain of course
    /\.hamsterbox\.xyz$/, // main domain of course
  ];

  /**
   * @dev Define blacklisted origins.
   */
  const blackListedOrigins: RegExp[] = [];

  /**
   * @dev Enable CORS policy.
   */
  adapter.enableCors({
    /**
     * @dev CORS policy handler.
     * @param origin
     * @param cb
     */
    origin: function (origin, cb) {
      /**
       * @dev If origin isn't available, which means in server env, allow processing.
       */
      if (!origin) return cb(null, true);

      /**
       * @dev Handle blocking blacklisted origins.
       */
      if (
        blackListedOrigins.length > 0 &&
        blackListedOrigins.reduce((accum, elm) => {
          return accum || elm.test(origin);
        }, false)
      ) {
        return cb(new ForbiddenException('CORS::BLACKLISTED'));
      }

      /**
       * @dev Handle allowed origins.
       */
      if (
        allowedOrigins.length > 0 &&
        allowedOrigins.reduce((accum, elm) => {
          return accum || elm.test(origin);
        }, false)
      ) {
        return cb(null, origin);
      }

      /**
       * @dev For other origins.
       */
      return cb(null, '*');
    },
    /**
     * @dev Define allowed headers.
     */
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
    /**
     * @dev Must have preflights
     */
    preflightContinue: true,
    /**
     * @dev Allow cookies.
     */
    credentials: true,
    /**
     * @dev Define allowed methods.
     */
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE', 'PATCH'],
  });
};

/**
 * @dev Bootstrap function declaration.
 */
async function bootstrap() {
  /**
   * @dev Initialize fastify adapter.
   */
  const adapter = new FastifyAdapter();

  /**
   * @dev Apply CORS policy.
   */
  applyCORSPolicy(adapter);

  /**
   * @dev Initialize app
   */
  const app = await createMainAppHandler(AppModule, adapter);
  await globalApply(app);

  /**
   * @dev Handle swagger stuffs.
   */
  if (registry.getConfig().NODE_ENV !== 'test') {
    const config = new DocumentBuilder()
      .setTitle('Hamsterpassport Broker API')
      .setDescription('Todo: update description')
      .setVersion('1.0')
      .addTag('Hamsterpassport')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'jwt',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    });

    SwaggerModule.setup('api', app, document);
  }

  /**
   * @dev Extract server configurations.
   */
  const nodeEnv = registry.getConfig().NODE_ENV;
  const port = registry.getConfig().PORT;
  const host = registry.getConfig().HOST;

  /**
   * @dev Start application.
   */
  if (nodeEnv === 'production') {
    await app.listen(port, host);
  } else {
    await app.listen(port);
  }

  console.log(`App is running at: ${host}:${port}`);
  return app;
}

bootstrap();
