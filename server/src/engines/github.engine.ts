import { Engine } from '@kb-abstracts';
import { PullRequestService, RepoService, UserService } from '@kb-api';
import { IGithubPullRequestEvent } from '@kb-interfaces';
import { PullRequest, Repo, User } from '@kb-models';


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
    const repoDto = new Repo({
      fullname: eventData.repository.full_name,
      name: eventData.repository.name,
      url: eventData.repository.html_url,
      organization: eventData.repository.owner.type === 'Organization' ?
        eventData.repository.owner.login : undefined
    });

    await this.reposService.create(repoDto);

    return;
  }
  async handlePullRequestOpened(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    // throw new Error('Method not implemented.');
    const githubPR = eventData.pull_request;
    const githubCreator = eventData.pull_request.user;
    const githubOwner = eventData.repository.owner;

    const creator = new User({
      username: githubCreator.login,
      url: githubCreator.html_url,
      avatar: githubCreator.avatar_url
    });

    let organization: User;
    if (githubOwner.type === 'Organization') {
      organization = new User({
        username: githubOwner.login,
        url: githubOwner.html_url,
        avatar: githubOwner.avatar_url,
        organization: true
      });

      await this.usersService.create(organization);
    }

    await this.usersService.create(creator);

    const repository = new Repo({
      fullname: eventData.repository.full_name,
      name: eventData.repository.name,
      url: eventData.repository.html_url,
      organization: eventData.repository.owner.type === 'Organization' ?
        eventData.repository.owner.login : undefined
    });

    await this.reposService.create(repository);

    const pullRequest = new PullRequest({
      id: `${ repository.fullname }/pull/${ githubPR.number }`,
      title: githubPR.title,
      description: githubPR.body,
      number: githubPR.number,
      creator: creator.username,
      createdOn: new Date(githubPR.created_at),
      url: githubPR.html_url,
      repository: repository.fullname
    });

    pullRequest.organization = organization && organization.username;

    await this.pullRequestsService.create(pullRequest);

    return;
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
