import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { BaseService } from '@kb-abstracts';
import { IGithubChanges } from '@kb-interfaces';
import { PullRequest, User } from '@kb-models';

export interface INewData {
  title?: string;
  description?: string;
}

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

  async editPRData(prid: string, newData: INewData, changes: IGithubChanges) {
    const historyUpdate = {
      $addToSet: {
        'history.title': changes.title?.from,
        'history.description': changes.body?.from
      }
    };

    await this.prModel.findOneAndUpdate({ prid }, {
      ...newData,
      ...historyUpdate
    });
  }

  async updateAssignees(prid: string, assignees: User[]) {
    await this.prModel.findOneAndUpdate({ prid }, {
      assignees: assignees.map((user) => user.username)
    });
  }

  async updateReviewers(prid: string, reviewer: User, forRemoval?: boolean) {
    const changeQuery = {
      $pull: {} as any,
      $addToSet: {} as any
    };
    const addDelAttr = forRemoval ? '$pull' : '$addToSet';
    changeQuery[addDelAttr].reviewers = reviewer.username;
    if (forRemoval) {
      changeQuery['$addToSet']['history.deletedReviewers'] = reviewer.username;
    }
    await this.prModel.findOneAndUpdate({ prid }, changeQuery);
  }
}
