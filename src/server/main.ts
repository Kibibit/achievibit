import * as pkginfo from 'pkginfo';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { KibibitLoggerService } from './services/kibibit-logger.service';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(KibibitLoggerService));

  app.useStaticAssets(join(__dirname, './frontend/public'));
  // app.setBaseViewsDir(join(__dirname, './frontend/views'));

  const options = new DocumentBuilder()
    .setTitle(module.exports.name)
    .setDescription('achievibit API endpoints')
    .setVersion(module.exports.version)
    .setContactEmail(module.exports.author)
    // .setHost('https://achievibit.kibibit.io')
    .setLicense(module.exports.license, '')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: `kibibit - achievibit API documentation`,
    customCss: readFileSync(join(__dirname, '../client/public/styles/swagger.css'), 'utf8'),
    customJs: '../scripts/swagger.js',
    customfavIcon: '../assets/favicons/favicon-32.png'
  });

  await app.listen(3000);
}

bootstrap();
