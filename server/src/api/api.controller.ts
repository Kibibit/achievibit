import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { readJSON } from 'fs-extra';
import { chain } from 'lodash';
import { join } from 'path';

import { ConfigService } from '@kb-config';
import { ApiInfo } from '@kb-models';

@Controller('api')
export class ApiController {
  readonly appRoot: string;
  private readonly logger = new Logger(ApiController.name);

  constructor(private readonly configService: ConfigService) {
    this.appRoot = this.configService.appRoot;
  }

  @Get()
  @ApiOperation({ summary: 'Get API Information' })
  @ApiOkResponse({
    description: 'Returns API info as a JSON',
    type: ApiInfo
  })
  async getAPI() {
    const packageInfo = await readJSON(
      join(this.appRoot, './package.json')
    );
    const details = new ApiInfo(
      chain(packageInfo)
      .pick([
        'name',
        'description',
        'version',
        'license',
        'repository',
        'author',
        'bugs'
      ])
      .mapValues((val) => val.url ? val.url : val)
      .value()
    );
    this.logger.log('Api information requested');
    return details;
  }

  @Get('/nana')
  @ApiOperation({
    deprecated: true
  })
  async deprecationTest() {
    return new Promise((resolve) => setTimeout(() => resolve('hello'), 60000));
  }
}
