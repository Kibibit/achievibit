import { Injectable, Logger } from '@nestjs/common';
import { isEqual } from 'lodash';

import { GithubEngine } from '@kb-engines';

import { PullRequestsService } from '../pull-requests/pull-requests.service';
import { ReposService } from '../repos/repos.service';
import { UsersService } from '../users/users.service';
import { AchievibitEventNames } from './achievibit-event-names.enum';

@Injectable()
export class GithubEventManagerService {
  logger: Logger = new Logger('GithubEventManagerService');
  githubEngine: GithubEngine;

  constructor(
    private usersService: UsersService,
    private reposService: ReposService,
    private pullRequestsService: PullRequestsService
  ) {
    this.githubEngine = new GithubEngine(this.usersService, this.reposService, this.pullRequestsService);
  }

  async postFromWebhook(githubHeader: string, body: any): Promise<any> {
    this.logger.log('got a post about ' + githubHeader);

    return await this.notifyAchievements(githubHeader, body);
  }

  async notifyAchievements(githubEvent: string, eventData: any): Promise<any> {
    const eventName = this.translateToEventName(githubEvent, eventData);

    switch (eventName) {
      case AchievibitEventNames.NewConnection:
        this.logger.debug('handleNewConnection');
        await this.githubEngine.handleNewConnection(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestOpened:
        this.logger.debug('PullRequestOpened');
        await this.githubEngine.handlePullRequestOpened(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestInitialLabeled:
        this.logger.debug('PullRequestInitialLabeled');
        return eventName;
      case AchievibitEventNames.PullRequestLableAdded:
        this.logger.debug('PullRequestLableAdded');
        return eventName;
      case AchievibitEventNames.PullRequestLabelRemoved:
        this.logger.debug('PullRequestLabelRemoved');
        return eventName;
      case AchievibitEventNames.PullRequestEdited:
        this.logger.debug('PullRequestEdited');
        return eventName;
      case AchievibitEventNames.PullRequestAssigneeAdded:
      case AchievibitEventNames.PullRequestAssigneeRemoved:
        this.logger.debug('PullRequestAssignee');
        return eventName;
      case AchievibitEventNames.PullRequestReviewRequestAdded:
        this.logger.debug('PullRequestReviewRequestAdded');
        return eventName;
      case AchievibitEventNames.PullRequestReviewRequestRemoved:
        this.logger.debug('PullRequestReviewRequestRemoved');
        return eventName;
      case AchievibitEventNames.PullRequestReviewCommentAdded:
        this.logger.debug('PullRequestReviewCommentAdded');
        return eventName;
      case AchievibitEventNames.PullRequestReviewCommentRemoved:
        this.logger.debug('PullRequestReviewCommentRemoved');
        return eventName;
      case AchievibitEventNames.PullRequestReviewCommentEdited:
        this.logger.debug('PullRequestReviewCommentEdited');
        return eventName;
      case AchievibitEventNames.PullRequestReviewSubmitted:
        this.logger.debug('PullRequestReviewSubmitted');
        return eventName;
      case AchievibitEventNames.PullRequestMerged:
        this.logger.debug('PullRequestMerged');
        return eventName;
    }
  }

  translateToEventName(eventName: string, eventData: any): AchievibitEventNames {
    console.log('the event name is:', eventName);
    if (isEqual(eventName, 'ping')) {
      return AchievibitEventNames.NewConnection;
    }

    if (isEqual(eventName, 'pull_request') &&
      // _.isEqual(eventData.action, 'reopened') ?
      isEqual(eventData.action, 'opened')) {
      return AchievibitEventNames.PullRequestOpened;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'labeled') &&
      isEqual(
        eventData.pull_request.updated_at,
        eventData.pull_request.created_at)
    ) {
      return AchievibitEventNames.PullRequestInitialLabeled;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'labeled')) {
      return AchievibitEventNames.PullRequestLableAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'unlabeled')) {
      return AchievibitEventNames.PullRequestLabelRemoved;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'edited')) {
      return AchievibitEventNames.PullRequestEdited;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'assigned')) {
      return AchievibitEventNames.PullRequestAssigneeAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'unassigned')) {
      return AchievibitEventNames.PullRequestAssigneeRemoved;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'review_requested')) {
      return AchievibitEventNames.PullRequestReviewRequestAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'review_request_removed')) {
      return AchievibitEventNames.PullRequestReviewRequestRemoved;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'created')) {
      return AchievibitEventNames.PullRequestReviewCommentAdded;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'deleted')) {
      return AchievibitEventNames.PullRequestReviewCommentRemoved;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'edited')) {
      return AchievibitEventNames.PullRequestReviewCommentEdited;
    }

    if (isEqual(eventName, 'pull_request_review') &&
      isEqual(eventData.action, 'submitted')) {
      return AchievibitEventNames.PullRequestReviewSubmitted;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'closed') &&
      eventData.pull_request.merged) {
      return AchievibitEventNames.PullRequestMerged;
    }

    return;
  }
}
