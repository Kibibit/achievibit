import { Injectable, Logger } from '@nestjs/common';
import { isEqual } from 'lodash';

export enum AchievibitEventName {
  NewConnection = 'NewConnection',
  PullRequestOpened = 'PullRequestOpened',
  PullRequestInitialLabeled = 'PullRequestInitialLabeled',
  PullRequestLableAdded = 'PullRequestLableAdded',
  PullRequestLabelRemoved = 'PullRequestLabelRemoved',
  PullRequestEdited = 'PullRequestEdited',
  PullRequestAssigneeAdded = 'PullRequestAssigneeAdded',
  PullRequestAssigneeRemoved = 'PullRequestAssigneeRemoved',
  PullRequestReviewRequestAdded = 'PullRequestReviewRequestAdded',
  PullRequestReviewRequestRemoved = 'PullRequestReviewRequestRemoved',
  PullRequestReviewCommentAdded = 'PullRequestReviewCommentAdded',
  PullRequestReviewCommentRemoved = 'PullRequestReviewCommentRemoved',
  PullRequestReviewCommentEdited = 'PullRequestReviewCommentEdited',
  PullRequestReviewSubmitted = 'PullRequestReviewSubmitted',
  PullRequestMerged = 'PullRequestMerged'

}

@Injectable()
export class GithubEventManagerService {
  logger: Logger = new Logger('GithubEventManagerService');

  async postFromWebhook(githubHeader: string, body: any): Promise<any> {
    this.logger.log('got a post about ' + githubHeader);

    return await this.notifyAchievements(githubHeader, body);
  }

  async notifyAchievements(githubEvent: string, eventData: any): Promise<any> {
    const eventName = this.translateToEventName(githubEvent, eventData);

    switch (eventName) {
      case AchievibitEventName.NewConnection:
        this.logger.debug('handleNewConnection');
        return;
      case AchievibitEventName.PullRequestOpened:
        this.logger.debug('PullRequestOpened');
        return;
      case AchievibitEventName.PullRequestInitialLabeled:
        this.logger.debug('PullRequestInitialLabeled');
        return;
      case AchievibitEventName.PullRequestLableAdded:
        this.logger.debug('PullRequestLableAdded');
        return;
      case AchievibitEventName.PullRequestLabelRemoved:
        this.logger.debug('PullRequestLabelRemoved');
        return;
      case AchievibitEventName.PullRequestEdited:
        this.logger.debug('PullRequestEdited');
        return;
      case AchievibitEventName.PullRequestAssigneeAdded:
      case AchievibitEventName.PullRequestAssigneeRemoved:
        this.logger.debug('PullRequestAssignee');
        return;
      case AchievibitEventName.PullRequestReviewRequestAdded:
        this.logger.debug('PullRequestReviewRequestAdded');
        return;
      case AchievibitEventName.PullRequestReviewRequestRemoved:
        this.logger.debug('PullRequestReviewRequestRemoved');
        return;
      case AchievibitEventName.PullRequestReviewCommentAdded:
        this.logger.debug('PullRequestReviewCommentAdded');
        return;
      case AchievibitEventName.PullRequestReviewCommentRemoved:
        this.logger.debug('PullRequestReviewCommentRemoved');
        return;
      case AchievibitEventName.PullRequestReviewCommentEdited:
        this.logger.debug('PullRequestReviewCommentEdited');
        return;
      case AchievibitEventName.PullRequestReviewSubmitted:
        this.logger.debug('PullRequestReviewSubmitted');
        return;
      case AchievibitEventName.PullRequestMerged:
        this.logger.debug('PullRequestMerged');
        return;
    }
  }

  translateToEventName(eventName: string, eventData: any): AchievibitEventName {
    if (isEqual(eventName, 'ping')) {
      return AchievibitEventName.NewConnection;
    }

    if (isEqual(eventName, 'pull_request') &&
      // _.isEqual(eventData.action, 'reopened') ?
      isEqual(eventData.action, 'opened')) {
      return AchievibitEventName.PullRequestOpened;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'labeled') &&
      isEqual(
        eventData.pull_request.updated_at,
        eventData.pull_request.created_at)
    ) {
      return AchievibitEventName.PullRequestInitialLabeled;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'labeled')) {
      return AchievibitEventName.PullRequestLableAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'unlabeled')) {
      return AchievibitEventName.PullRequestLabelRemoved;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'edited')) {
      return AchievibitEventName.PullRequestEdited;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'assigned')) {
      return AchievibitEventName.PullRequestAssigneeAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'unassigned')) {
      return AchievibitEventName.PullRequestAssigneeRemoved;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'review_requested')) {
      return AchievibitEventName.PullRequestReviewRequestAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'review_request_removed')) {
      return AchievibitEventName.PullRequestReviewRequestRemoved;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'created')) {
      return AchievibitEventName.PullRequestReviewCommentAdded;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'deleted')) {
      return AchievibitEventName.PullRequestReviewCommentRemoved;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'edited')) {
      return AchievibitEventName.PullRequestReviewCommentEdited;
    }

    if (isEqual(eventName, 'pull_request_review') &&
      isEqual(eventData.action, 'submitted')) {
      return AchievibitEventName.PullRequestReviewSubmitted;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'closed') &&
      eventData.pull_request.merged) {
      return AchievibitEventName.PullRequestMerged;
    }

    return;
  }
}
