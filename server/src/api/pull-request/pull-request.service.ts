import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { BaseService } from '@kb-abstracts';
import { PullRequest } from '@kb-models';

@Injectable()
export class PullRequestService extends BaseService<PullRequest> {
  constructor(
    @InjectModel(PullRequest.modelName)
    private readonly prModel: ReturnModelType<typeof PullRequest>
  ) {
    super(prModel, PullRequest);
  }

  async addLabels(prid: string, label: string, init = false) {
    const historyUpdate = init ? {
      $set: { 'history.labels': { added: 0, removed: 0 } }
    } : { $inc: { 'history.labels.added': 1 } };
    await this.prModel.findOneAndUpdate({ prid }, {
      $addToSet: {
        labels: label
      },
      ...historyUpdate
    }).exec();
  }

  async removeLabels(prid: string, label: string, init = false) {
    const historyUpdate = init ? {
      $set: { 'history.labels': { added: 0, removed: 0 } }
    } : { $inc: { 'history.labels.removed': 1 } };
    await this.prModel.findOneAndUpdate({ prid }, {
      $pull: {
        labels: label
      },
      ...historyUpdate
    }).exec();
  }
}
