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

  async handleNewConnection(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    console.log('connection mock!');
    return;
  }
  async handlePullRequestOpened(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestInitialLabeled(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestLabelAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestLabelRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestEdited(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestAssigneeAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestAssigneeRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestReviewRequestAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestReviewRequestRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestReviewCommentAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestReviewCommentRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestReviewCommentEdited(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestReviewSubmitted(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
  async handlePullRequestMerged(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    return;
  }
}
