import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetAll } from '@kb-decorators';
import { KbValidationExceptionFilter } from '@kb-filters';
import { PullRequest } from '@kb-models';

import { PullRequestService } from './pull-request.service';

@Controller('api/pull-request')
@ApiTags('Pull Request')
@UseFilters(new KbValidationExceptionFilter())
export class PullRequestController {
  constructor(private prService: PullRequestService) { }

  @GetAll(PullRequest)
  async getAll(): Promise<PullRequest[]> {
    const allPRs = await this.prService.findAllAsync();
    const allPRsParsed = allPRs.map((dbPR) => new PullRequest(dbPR.toObject()));

    return allPRsParsed;
  }
}
