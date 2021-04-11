import { terminalConsoleLogo } from '@kibibit/consologo';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { join } from 'path';

import { AppModule, AppService } from '@kb-app';
import { KbNotFoundExceptionFilter } from '@kb-filters';

import { Swagger } from './swagger';

const appRoot = new AppService().appRoot;

export async function bootstrap(): Promise<NestExpressApplication> {
  terminalConsoleLogo('kibibit server template', [
    'change this in server/src/bootstrap-application.ts'
  ]);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app))
  app.useGlobalFilters(new KbNotFoundExceptionFilter(appRoot));
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(appRoot, './dist/client'));

  await Swagger.addSwagger(app);

  return app;
}
