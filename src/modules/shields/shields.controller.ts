import { Controller, Get, Header, Redirect, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

import { ShieldsService } from './shields.service';

@Controller('api/shields')
@ApiTags('Shields')
export class ShieldsController {
  constructor(private readonly shieldsService: ShieldsService) { }

  @Get()
  @Redirect('api/shields/achievements', HttpStatus.MOVED_PERMANENTLY)
  @ApiOperation({ summary: 'Redirects to api/shields/achievements' })
  @ApiResponse({ status: HttpStatus.MOVED_PERMANENTLY })
  redirectToGetAchievementsShield() {

  }

  @Get('achievements')
  @Header('Content-Type', 'image/svg+xml;charset=utf-8')
  @Header('Pragma-directive', 'no-cache')
  @Header('Cache-directive', 'no-cache')
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @ApiOperation({ summary: 'Returns achievements shield' })
  async getAchievementsShield(): Promise<string> {
    return await this.shieldsService.createAchievementsShield();
  }
}
