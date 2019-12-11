import { Injectable } from '@nestjs/common';
import { isEqual } from 'lodash';

enum GitHubEventName {
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
  async postFromWebhook(githubHeader: string, body: any): Promise<any> {
    console.log('got a post about ' + githubHeader);

    return await this.notifyAchievements(githubHeader, body);
  }

  async notifyAchievements(githubEvent: string, eventData: any): Promise<any> {
    const eventName = this.translateToEventName(githubEvent, eventData);

    switch (eventName) {
      case GitHubEventName.NewConnection:
        this.handleNewConnection();
        return;
      case GitHubEventName.PullRequestOpened:
        this.handlePullRequestOpened();
        return;
      case GitHubEventName.PullRequestInitialLabeled:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestLableAdded:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestLabelRemoved:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestEdited:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestAssigneeAdded:
      case GitHubEventName.PullRequestAssigneeRemoved:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestReviewRequestAdded:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestReviewRequestRemoved:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestReviewCommentAdded:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestReviewCommentRemoved:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestReviewCommentEdited:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestReviewSubmitted:
        this.handlePullReuqestInitialLabeled();
        return;
      case GitHubEventName.PullRequestMerged:
        this.handlePullReuqestInitialLabeled();
        return;
    }
  }

  private handlePullReuqestInitialLabeled() { }

  private handlePullRequestOpened() { }

  private handleNewConnection() { }

  private translateToEventName(eventName: string, eventData: any): GitHubEventName {
    if (isEqual(eventName, 'ping')) {
      return GitHubEventName.NewConnection;
    }

    if (isEqual(eventName, 'pull_request') &&
      //_.isEqual(eventData.action, 'reopened') ?
      isEqual(eventData.action, 'opened')) {
      return GitHubEventName.PullRequestOpened;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'labeled') &&
      isEqual(
        eventData.pull_request.updated_at,
        eventData.pull_request.created_at)
    ) {
      return GitHubEventName.PullRequestInitialLabeled;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'labeled')) {
      return GitHubEventName.PullRequestLableAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'unlabeled')) {
      return GitHubEventName.PullRequestLabelRemoved;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'edited')) {
      return GitHubEventName.PullRequestEdited;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'assigned')) {
      return GitHubEventName.PullRequestAssigneeAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'unassigned')) {
      return GitHubEventName.PullRequestAssigneeRemoved;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'review_requested')) {
      return GitHubEventName.PullRequestReviewRequestAdded;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'review_request_removed')) {
      return GitHubEventName.PullRequestReviewRequestRemoved;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'created')) {
      return GitHubEventName.PullRequestReviewCommentAdded;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'deleted')) {
      return GitHubEventName.PullRequestReviewCommentRemoved;
    }

    if (isEqual(eventName, 'pull_request_review_comment') &&
      isEqual(eventData.action, 'edited')) {
      return GitHubEventName.PullRequestReviewCommentEdited;
    }

    if (isEqual(eventName, 'pull_request_review') &&
      isEqual(eventData.action, 'submitted')) {
      return GitHubEventName.PullRequestReviewSubmitted;
    }

    if (isEqual(eventName, 'pull_request') &&
      isEqual(eventData.action, 'closed') &&
      eventData.pull_request.merged) {
      return GitHubEventName.PullRequestMerged;
    }

    return;
  }
}
