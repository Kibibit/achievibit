import { ReturnModelType } from '@typegoose/typegoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from '@kb-abstracts';
import { Repo } from '@kb-models';

@Injectable()
export class RepoService extends BaseService<Repo> {
  constructor(
    @InjectModel(Repo.modelName)
    private readonly repoModel: ReturnModelType<typeof Repo>
  ) {
    super(repoModel, Repo);
  }

  async findAllRepos(): Promise<Repo[]> {
    const dbRepos = await this.findAll().exec();

    return dbRepos.map((repo) => new Repo(repo.toObject()));
  }

  async findByName(name: string): Promise<Repo> {
    const dbRepo = await this.findOne({ name }).exec();

    if (!dbRepo) {
      return;
    }

    return new Repo(dbRepo.toObject());
  }
}
