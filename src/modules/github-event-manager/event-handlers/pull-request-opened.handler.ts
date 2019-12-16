import { UserDto } from '@kb-models';

import { IGithubPullRequestEvent } from '../github-pr-payload.model';

export function pullRequestOpenedHandler(eventData: IGithubPullRequestEvent) {
  const githubCreator = eventData.pull_request.user;
  const githubOwner = eventData.repository.owner;

  const creator = new UserDto({
    username: githubCreator.login,
    url: githubCreator.html_url,
    avatar: githubCreator.avatar_url
  });

  if (githubOwner.type === 'Organization') {
    const organization = new UserDto({
      username: githubOwner.login,
      url: githubOwner.html_url,
      avatar: githubOwner.avatar_url,
      organization: true
    });

    return { creator, organization };
  }

  return { creator };
}
