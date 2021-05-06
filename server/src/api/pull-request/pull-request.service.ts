/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReturnModelType } from '@typegoose/typegoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseService } from '@kb-abstracts';
import { IGithubChanges } from '@kb-interfaces';
import { IReviewComment, PRStatus, PullRequest, User } from '@kb-models';

export interface INewData {
  title?: string;
  description?: string;
}

export interface IFetchedData {
  comments: any[];
  reviewComments: any[];
  commits: any[];
  files: any[];
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

  async addReviewComment(prid: string, comment: IReviewComment) {
    const changeQuery = {
      $pull: {} as any,
      $addToSet: {} as any
    };
    const addDelAttr = '$addToSet';
    changeQuery[addDelAttr].reviewComments = comment;
    await this.prModel.findOneAndUpdate({ prid }, changeQuery);
  }

  async removeReviewComment(
    prid: string,
    comment: IReviewComment
  ) {
    const changeQuery = {
      $pull: {} as any,
      $addToSet: {} as any
    };
    changeQuery['$pull'].reviewComments = { id: comment.id };
    changeQuery['$addToSet']
      ['history.reviewComments.deleted'] = comment.id;
    await this.prModel.findOneAndUpdate({ prid }, changeQuery);
  }

  async editReviewComment(prid: string, comment: IReviewComment) {
    const changeQuery = {
      $set: {
        'reviewComments.$.body': comment.message,
        'reviewComments.$.edited': true
      },
      $addToSet: {
        'history.reviewComments.edited': comment.id
      }
    };
    await this.prModel.findOneAndUpdate({
      prid,
      'reviewComments.id': comment.id
    }, changeQuery);
  }

  async updateReviewSubmitted(prid: string, review: any) {
    const changeQuery = {
      $addToSet: {
        'reviews': review
      }
    };
    await this.prModel.findOneAndUpdate({
      prid
    }, changeQuery);
  }

  async updatePRStatus(prid: string, newStatus: PRStatus) {
    return await this.prModel.findOneAndUpdate({ prid }, {
      status: newStatus
    });
  }

  async updatePRExtraData(prid: string, extraData: IFetchedData) {
    return await this.prModel.findOneAndUpdate({ prid }, {
      ...extraData
    });
  }
}
