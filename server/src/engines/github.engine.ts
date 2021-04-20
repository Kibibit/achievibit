import { Engine } from '@kb-abstracts';
import { PullRequestService, RepoService, UserService } from '@kb-api';
import { IGithubPullRequestEvent } from '@kb-interfaces';


export class GithubEngine extends Engine<IGithubPullRequestEvent> {

  constructor(
    private usersService: UserService,
    private reposService: RepoService,
    private pullRequestsService: PullRequestService
  ) {
    super();
  }

  handleNewConnection(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestOpened(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestInitialLabeled(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestLabelAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestLabelRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestEdited(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestAssigneeAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestAssigneeRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewRequestAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewRequestRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewCommentAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewCommentRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewCommentEdited(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewSubmitted(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestMerged(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
