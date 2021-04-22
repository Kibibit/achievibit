import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

import { ConfigService } from '@kb-config';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Get Web Client (HTML)' })
  @ApiOkResponse({
    description: 'Returns the Web Client\'s HTML File'
  })
  sendWebClient(@Res() res: Response): void {
    res.sendFile(join(this.configService.appRoot, '/dist/client/index.html'));
  }
}
