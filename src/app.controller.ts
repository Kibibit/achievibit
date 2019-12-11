import { PackageDetailsDto } from '@kb-models/package-details.model';
import { ReposService } from '@kb-modules/repos/repos.service';
import { UsersService } from '@kb-modules/users/users.service';
import { ClassSerializerInterceptor, Controller, Get, HttpStatus, Render, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { groupBy } from 'lodash';

import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reposService: ReposService,
    private readonly usersService: UsersService
  ) { }

  @Get()
  @ApiOperation({ summary: `Return achievibit's homepage` })
  @Render('index.njk')
  async getHomepage(): Promise<any> {
    const repos = await this.reposService.findAll();
    const allUsers = await this.usersService.findAll();
    const groupedUsers = groupBy(allUsers, 'organization');
    const users = groupedUsers.undefined;
    const organizations = groupedUsers.true;

    console.log(allUsers);
    console.log(groupedUsers);

    return { repos, users, organizations };
  }

  @Get('api')
  @ApiOperation({ summary: `API Hello endpoint. Returns achievebit's package information` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: `achievibit's package information`,
    type: PackageDetailsDto
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getAchievibitPackageInfo(): Promise<PackageDetailsDto> {
    return await this.appService.getPackageDetails();
  }
}
