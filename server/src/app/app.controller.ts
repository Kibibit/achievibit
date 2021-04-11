import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Web Client (HTML)' })
  @ApiOkResponse({
    description: 'Returns the Web Client\'s HTML File'
  })
  sendWebClient(@Res() res: Response): void {
    res.sendFile(join(this.appService.appRoot, '/dist/client/index.html'));
  }
}
