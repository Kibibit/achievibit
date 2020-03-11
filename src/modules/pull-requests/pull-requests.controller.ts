import { Controller, Get } from '@nestjs/common';

import { PullRequestDto } from '@kb-models';

import { PullRequestsService } from './pull-requests.service';

@Controller('pull-requests')
export class PullRequestsController {
  constructor(private prService: PullRequestsService) { }

  @Get()
  async getAll(): Promise<PullRequestDto[]> {
    return this.prService.findAll();
  }
}
