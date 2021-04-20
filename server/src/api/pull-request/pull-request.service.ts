import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { BaseService } from '@kb-abstracts';
import { PullRequest } from '@kb-models';

@Injectable()
export class PullRequestService extends BaseService<PullRequest> {
  constructor(
    @InjectModel(PullRequest.modelName)
    private readonly repoModel: ReturnModelType<typeof PullRequest>
  ) {
    super(repoModel, PullRequest);
  }
}
