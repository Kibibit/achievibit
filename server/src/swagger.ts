import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';

import { ConfigService } from '@kb-config';

interface ISwaggerMethod {
  get: (attr: string) => string;
}

const config = new ConfigService();

export class Swagger {
  static title = config.packageDetails.name;
  static swaggerPath = 'api/docs';
  static config = new DocumentBuilder()
    .setTitle(Swagger.title)
    .setDescription(config.packageDetails.description)
    .setVersion(config.packageDetails.version)
    .setContact(
      'thatkookooguy',
      'github.com/thatkookooguy',
      'thatkookooguy@kibibit.io'
    )
    .addTag(
      'user',
      [
        'achievibit user endpoints. Users are created by GitHub, ',
        'so you can only retrieve existing users'
      ].join('')
    )
    .addTag(
      'repo',
      [
        'achievibit repo endpoints. Repos are created by GitHub, ',
        'so you can only retrieve existing repos'
      ].join('')
    )
    .addTag(
      'Pull Request',
      [
        '**WARNING**: This should not be exposed in production. ',
        'The entire pull-request controller should appear only in dev ',
        'environments'
      ].join('')
    )
    .addTag(
      'Webhook Event Manager',
      'Handles webhook event data sent from cloud version control'
    )
    .addTag(
      'default',
      'utility api endpoints'
    )
    .build();

  static getOperationsSorter() {
    return (a: ISwaggerMethod, b: ISwaggerMethod) => {
      const methodsOrder = [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'options',
        'trace'
      ];
      let result =
        methodsOrder.indexOf( a.get('method') ) -
        methodsOrder.indexOf( b.get('method') );

      if (result === 0) {
        result = a.get('path').localeCompare(b.get('path'));
      }

      return result;
    }
  }

  static async addSwagger(app: INestApplication) {
    const document = SwaggerModule.createDocument(app, Swagger.config);
    const swaggerCssResponse = await axios
      .get('https://kibibit.io/kibibit-assets/swagger/swagger.css');
    const customCss = swaggerCssResponse.data;

    SwaggerModule.setup(Swagger.swaggerPath, app, document, {
      customSiteTitle: Swagger.title,
      customCss,
      customJs: '//kibibit.io/kibibit-assets/swagger/swagger.js',
      swaggerOptions: {
        docExpansion: 'none',
        apisSorter: 'alpha',
        operationsSorter: Swagger.getOperationsSorter()
      }
    });
  }
}
