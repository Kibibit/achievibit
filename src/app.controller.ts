import { ClassSerializerInterceptor, Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { PackageDetailsDto } from './models/package-details.model';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: `API Hello endpoint. Returns achievebit's package information` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `achievibit's package information`,
    type: PackageDetailsDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getAchievibitPackageInfo(): Promise<PackageDetailsDto> {
    return await this.appService.getPackageDetails();
  }
}
