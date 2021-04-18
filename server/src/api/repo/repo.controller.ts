import {
  Controller,
  Logger,
  NotFoundException,
  Param,
  UseFilters
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetAll, GetOne } from '@kb-decorators';
import { KbValidationExceptionFilter } from '@kb-filters';
import { Repo } from '@kb-models';

import { RepoService } from './repo.service';

@Controller('api/repo')
@ApiTags('repo')
@UseFilters(new KbValidationExceptionFilter())
export class RepoController {
  private readonly logger = new Logger(RepoController.name);

  constructor(private readonly repoService: RepoService) {}

  @GetAll(Repo)
  async getAllRepos() {
    const repos = await this.repoService.findAllRepos();

    return repos;
  }

  @GetOne(Repo, ':name')
  async getRepo(@Param('name') name: string) {
    const repo = await this.repoService.findByName(name);

    if (!repo) {
      throw new NotFoundException(`Repo with name ${ name } not found`);
    }

    // will show secret fields as well!
    this.logger.log('Full Repo');
    // will log only public fields!
    this.logger.log(repo);
    // DANGER! WILL LOG EVERYTHING!
    // console.log(repo);

    // will only include exposed fields
    return repo;
  }
}
