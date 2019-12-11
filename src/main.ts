import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs-extra';
import { join } from 'path';

import { AppModule } from './app.module';
import { PackageDetailsDto } from './models/package-details.model';
import { ConfigService } from './config/config.service';

async function bootstrap() {
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
  // SwaggerModule.setup('api/docs', app, document);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: `kibibit - achievibit API documentation`,
    customCss: readFileSync(join(__dirname, '../public/swagger.css'), 'utf8'),
    // customJs: '../swagger-things/swagger.js',
    // customfavIcon: '../swagger-things/favicon-32.png'
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(config.port);
}
bootstrap();
