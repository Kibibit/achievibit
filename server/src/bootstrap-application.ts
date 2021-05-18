import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';

import { terminalConsoleLogo } from '@kibibit/consologo';
import { WINSTON_MODULE_NEST_PROVIDER } from '@kibibit/nestjs-winston';

import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import { KbNotFoundExceptionFilter } from '@kb-filters';

import { Swagger } from './swagger';

const config = new ConfigService();
const appRoot = config.appRoot;

export async function bootstrap(): Promise<NestExpressApplication> {
  terminalConsoleLogo(config.packageDetails.name, [
    `version ${ config.packageDetails.version }`
  ]);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new KbNotFoundExceptionFilter(appRoot));
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(appRoot, './dist/client'));

  await Swagger.addSwagger(app);

  return app;
}
