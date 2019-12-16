import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { groupBy } from 'lodash';

import { PackageDetailsDto } from '@kb-models';
import { GithubEventManagerService, ReposService, UsersService } from '@kb-modules';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly reposService: ReposService,
    private readonly usersService: UsersService,
    private readonly githubEventManagerService: GithubEventManagerService
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

  @Post()
  @ApiOperation({ summary: `Recieve GitHub Webhooks` })
  async recieveGitHubWebhooks(@Headers('x-github-event') githubEvent: string, @Body() eventBody: any) {
    await this.githubEventManagerService.postFromWebhook(githubEvent, eventBody);

    return;
  }
}
