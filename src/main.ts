import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs-extra';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const options = new DocumentBuilder()
    .setTitle('achievibit')
    .setDescription('The achievibit API description')
    .setVersion('1.0')
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

  await app.listen(10101);
}
bootstrap();
