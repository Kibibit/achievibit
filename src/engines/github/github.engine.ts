import { IEngine, PullRequestDto, RepoDto, User } from '@kb-models';
import { IGithubPullRequestEvent, PullRequestsService, ReposService, UsersService } from '@kb-modules';

export class GithubEngine implements IEngine<IGithubPullRequestEvent> {
  constructor(
    private usersService: UsersService,
    private reposService: ReposService,
    private pullRequestsService: PullRequestsService
  ) { }

  async handleNewConnection(eventData: IGithubPullRequestEvent): Promise<void> {
    // throw new Error('Method not implemented.');
    const repoDto = new RepoDto({
      fullname: eventData.repository.full_name,
      name: eventData.repository.name,
      url: eventData.repository.html_url,
      organization: eventData.repository.owner.type === 'Organization' ?
        eventData.repository.owner.login : undefined
    });

    await this.reposService.create(repoDto);

    return;
  }
  async handlePullRequestOpened(eventData: IGithubPullRequestEvent): Promise<void> {
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

    const repository = new RepoDto({
      fullname: eventData.repository.full_name,
      name: eventData.repository.name,
      url: eventData.repository.html_url,
      organization: eventData.repository.owner.type === 'Organization' ?
        eventData.repository.owner.login : undefined
    });

    const pullRequest = new PullRequestDto({
      id: `${repository.fullname}/pull/${githubPR.number}`,
      title: githubPR.title,
      description: githubPR.body,
      number: githubPR.number,
      creator,
      createdOn: new Date(githubPR.created_at),
      url: githubPR.html_url,
      organization,
      repository
    });

    await this.pullRequestsService.create(pullRequest);

    return;
  }
  handlePullRequestInitialLabeled(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestLabelAdded(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestLabelRemoved(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestEdited(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestAssigneeAdded(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestAssigneeRemoved(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewRequestAdded(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewRequestRemoved(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewCommentAdded(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewCommentRemoved(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewCommentEdited(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestReviewSubmitted(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
  handlePullRequestMerged(eventData: IGithubPullRequestEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
