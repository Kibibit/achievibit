import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';

interface ISwaggerMethod {
  get: (attr: string) => string;
}

export class Swagger {
  static title = 'API Docs example';
  static swaggerPath = 'api/docs';
  static config = new DocumentBuilder()
    .setTitle(Swagger.title)
    .setDescription('The API description')
    .setVersion('1.0')
    .setContact(
      'thatkookooguy',
      'github.com/thatkookooguy',
      'thatkookooguy@kibibit.io'
    )
    .addTag(
      'product',
      [
        'Product is an example module to show how to ',
        'add **swagger** documentation'
      ].join(''),
      {
        url: 'https://github.com/kibibit',
        description: 'See Docs'
      }
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
