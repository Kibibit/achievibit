import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs-extra';
import nunjucks from 'nunjucks';
import { join } from 'path';

import { AppModule } from '@kb-app';
import { ConfigService } from '@kb-config';
import { PackageDetailsDto } from '@kb-models';

export async function bootstrap(): Promise<NestExpressApplication> {
  const config = new ConfigService();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const packageDetails: PackageDetailsDto =
    await app.get('AppService').getPackageDetails();

  const options = new DocumentBuilder()
    .setTitle(packageDetails.name)
    .setDescription('The achievibit API description')
    .setVersion(packageDetails.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const swaggerCssFile = join(config.appRoot, './public/swagger.css');

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: `kibibit - achievibit API documentation`,
    customCss: readFileSync(swaggerCssFile, 'utf8')
    // customJs: '../swagger-things/swagger.js',
    // customfavIcon: '../swagger-things/favicon-32.png'
  });

  app.useStaticAssets(join(config.appRoot, './public'), { prefix: '/public/' });
  app.setBaseViewsDir(join(config.appRoot, './views'));
  app.setViewEngine('njk');
  app.set('view engine', 'njk');
  nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
  });

  return app;
}
