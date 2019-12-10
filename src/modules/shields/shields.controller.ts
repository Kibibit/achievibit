import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ShieldsService } from './shields.service';

@Controller('api/shields')
@ApiTags('Shields')
export class ShieldsController {
  constructor(private readonly shieldsService: ShieldsService) { }

  @Get('achievements')
  // @Header('Content-Type', 'image/svg+xml;charset=utf-8')
  // @Header('Pragma-directive', 'no-cache')
  // @Header('Cache-directive', 'no-cache')
  // @Header('Pragma', 'no-cache')
  // @Header('Expires', '0')
  // @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @ApiOperation({ summary: 'Returns achievements shield' })
  async getAchievementsShield(): Promise<number> {
    return await this.shieldsService.createAchievementsShield();
  }
}
