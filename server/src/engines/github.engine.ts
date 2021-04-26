import { Engine } from '@kb-abstracts';
import { PullRequestService, RepoService, UserService } from '@kb-api';
import {
  IGithubPullRequest,
  IGithubPullRequestEvent,
  IGithubRepo,
  IGithubUser
} from '@kb-interfaces';
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
    const {
      githubCreator,
      githubOwner,
      githubPR
    } = this.extractGithubEntities(eventData);

    const creator = this.extractUser(githubCreator);
    await this.usersService.create(creator);

    let organization: User;
    if (githubOwner.type === 'Organization') {
      organization = this.extractUser(githubOwner);

      await this.usersService.create(organization);
    }

    const repository = this.extractRepo(eventData.repository);
    await this.reposService.create(repository);

    const pullRequest = this
      .extractPullRequest(githubPR, creator, repository, organization);

    await this.pullRequestsService.create(pullRequest);

    return;
  }
  async handlePullRequestInitialLabeled(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    const {
      githubCreator,
      githubOwner,
      githubPR
    } = this.extractGithubEntities(eventData);
    const pr = this.extractPullRequest(
      githubPR,
      this.extractUser(githubCreator),
      this.extractRepo(eventData.repository),
      this.extractUser(githubOwner)
    );
 
    await this.pullRequestsService.addLabels(pr.prid, eventData.label.name);
  }
  async handlePullRequestLabelAdded(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    const {
      githubCreator,
      githubOwner,
      githubPR
    } = this.extractGithubEntities(eventData);
    const pr = this.extractPullRequest(
      githubPR,
      this.extractUser(githubCreator),
      this.extractRepo(eventData.repository),
      this.extractUser(githubOwner)
    );
 
    await this.pullRequestsService.addLabels(pr.prid, eventData.label.name);
  }
  async handlePullRequestLabelRemoved(
    eventData: IGithubPullRequestEvent
  ): Promise<void> {
    const {
      githubCreator,
      githubOwner,
      githubPR
    } = this.extractGithubEntities(eventData);
    const pr = this.extractPullRequest(
      githubPR,
      this.extractUser(githubCreator),
      this.extractRepo(eventData.repository),
      this.extractUser(githubOwner)
    );
 
    await this.pullRequestsService.removeLabels(pr.prid, eventData.label.name);
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

  private extractGithubEntities(eventData: IGithubPullRequestEvent) {
    return {
      githubPR: eventData.pull_request,
      githubCreator: eventData.pull_request.user,
      githubOwner: eventData.repository.owner
    };
  }

  private extractUser(githubUser: IGithubUser) {
    if (!githubUser) { return; }
    const user = new User({
      username: githubUser.login,
      url: githubUser.html_url,
      avatar: githubUser.avatar_url,
      organization: githubUser.type === 'Organization'
    });

    return user;
  }

  private extractRepo(githubRepo: IGithubRepo) {
    if (!githubRepo) { return; }
    const repo = new Repo({
      fullname: githubRepo.full_name,
      name: githubRepo.name,
      url: githubRepo.html_url,
      organization: githubRepo.owner.type === 'Organization' ?
        githubRepo.owner.login : undefined
    });

    return repo;
  }

  private extractPullRequest(
    githubPR: IGithubPullRequest,
    creator: User,
    repository: Repo,
    organization?: User
  ) {
    const pullRequest = new PullRequest({
      prid: `${ repository.fullname }/pull/${ githubPR.number }`,
      title: githubPR.title,
      description: githubPR.body,
      number: githubPR.number,
      creator: creator.username,
      createdOn: new Date(githubPR.created_at),
      url: githubPR.html_url,
      repository: repository.fullname
    });

    pullRequest.organization = organization && organization.username;

    return pullRequest;
  }
}
