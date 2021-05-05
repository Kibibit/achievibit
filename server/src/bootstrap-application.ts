import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';

import { terminalConsoleLogo } from '@kibibit/consologo';

import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import { KbNotFoundExceptionFilter } from '@kb-filters';

import { Swagger } from './swagger';

const config = new ConfigService();
const appRoot = config.appRoot;

export async function bootstrap(): Promise<NestExpressApplication> {
  terminalConsoleLogo('kibibit server template', [
    'change this in server/src/bootstrap-application.ts'
  ]);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalFilters(new KbNotFoundExceptionFilter(appRoot));
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(appRoot, './dist/client'));

  await Swagger.addSwagger(app);

  return app;
}
