import { isEqual } from 'lodash';

import { Injectable } from '@nestjs/common';

import { WinstonLogger } from '@kibibit/nestjs-winston';

import { AchievibitEventNames } from '@kb-abstracts';
import { GithubEngine } from '@kb-engines';
import { IGithubPullRequestEvent } from '@kb-interfaces';

import { PullRequestService } from '../pull-request/pull-request.service';
import { RepoService } from '../repo/repo.service';
import { UserService } from '../user/user.service';

@Injectable()
export class WebhookEventManagerService {
  private readonly logger = new WinstonLogger('GithubEventManagerService');
  githubEngine: GithubEngine;

  constructor(
    private usersService: UserService,
    private reposService: RepoService,
    private pullRequestsService: PullRequestService
  ) {
    this.githubEngine = new GithubEngine(
      this.usersService,
      this.reposService,
      this.pullRequestsService
    );
  }

  async notifyAchievements(
    githubEvent: string,
    eventData: IGithubPullRequestEvent
  ): Promise<string> {
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
        await this.githubEngine.handlePullRequestInitialLabeled(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestLableAdded:
        this.logger.debug('PullRequestLableAdded');
        await this.githubEngine.handlePullRequestLabelAdded(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestLabelRemoved:
        this.logger.debug('PullRequestLabelRemoved');
        await this.githubEngine.handlePullRequestLabelRemoved(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestEdited:
        this.logger.debug('PullRequestEdited');
        await this.githubEngine.handlePullRequestEdited(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestAssigneeAdded:
        this.logger.debug('PullRequestAssignee');
        await this.githubEngine.handlePullRequestAssigneeAdded(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestAssigneeRemoved:
        this.logger.debug('PullRequestAssignee');
        await this.githubEngine.handlePullRequestAssigneeRemoved(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestReviewRequestAdded:
        this.logger.debug('PullRequestReviewRequestAdded');
        await this.githubEngine.handlePullRequestReviewRequestAdded(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestReviewRequestRemoved:
        this.logger.debug('PullRequestReviewRequestRemoved');
        await this.githubEngine
          .handlePullRequestReviewRequestRemoved(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestReviewCommentAdded:
        this.logger.debug('PullRequestReviewCommentAdded');
        await this.githubEngine.handlePullRequestReviewCommentAdded(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestReviewCommentRemoved:
        this.logger.debug('PullRequestReviewCommentRemoved');
        await this.githubEngine
          .handlePullRequestReviewCommentRemoved(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestReviewCommentEdited:
        this.logger.debug('PullRequestReviewCommentEdited');
        await this.githubEngine.handlePullRequestReviewCommentEdited(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestReviewSubmitted:
        this.logger.debug('PullRequestReviewSubmitted');
        await this.githubEngine.handlePullRequestReviewSubmitted(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestMerged:
        this.logger.debug('PullRequestMerged');
        await this.githubEngine.handlePullRequestMerged(eventData);
        return eventName;
      case AchievibitEventNames.PullRequestClosed:
        this.logger.debug('PullRequestClosed');
        await this.githubEngine.handlePullRequestClosed(eventData);
        return eventName;
    }
  }

  translateToEventName(
    eventName: string,
    eventData: IGithubPullRequestEvent
  ): AchievibitEventNames {
    // console.log('the event name is:', eventName);
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

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'closed') &&
      !eventData.pull_request.merged) {
      return AchievibitEventNames.PullRequestClosed;
    }

    return;
  }
}
