import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ConfigService} from "@nestjs/config";
import type {SwaggerConfig} from "./config/interfaces/config.interface";
import {Logger, RequestMethod, ValidationPipe, VersioningType} from "@nestjs/common";
import {ExceptionResponseTransformFilter} from "./system/filters/exception-response-transform.filter";
import {SuccessResponseTransformInterceptor} from "./system/interceptors/success-response-transform.interceptor";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import loggerConfig from "./config/logger/logger.config";
import helmet from "helmet";
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });
  app.enableCors();
  // app.use(csurf());
  app.use(cookieParser());
  app.use(compression());

  const config = app.get(ConfigService);

  app.setGlobalPrefix('/api', {
    exclude: [
      { path: 'metrics', method: RequestMethod.GET },
      { path: 'healthcheck', method: RequestMethod.GET },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // Transform payload objects
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ExceptionResponseTransformFilter());
  app.useGlobalInterceptors(new SuccessResponseTransformInterceptor(new Logger()));
  app.use(helmet());
  // include swagger
  const swaggerConfig: SwaggerConfig = config.get('swagger');

  SwaggerModule.setup(
    '/swagger',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(swaggerConfig.title)
        .setVersion(swaggerConfig.version)
        .setDescription(swaggerConfig.description)
        .build(),
    ),
  );

  await app.listen(config.get("server.port"));
}
bootstrap().then();
