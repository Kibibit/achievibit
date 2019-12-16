import { RepoDto } from '@kb-models';

import { IGithubPullRequestEvent } from '../github-pr-payload.model';

export function newConnectionHandler(eventData: IGithubPullRequestEvent): RepoDto {
  return new RepoDto({
    fullname: eventData.repository.full_name,
    name: eventData.repository.name,
    url: eventData.repository.html_url,
    organization: eventData.repository.owner.type === 'Organization' ?
      eventData.repository.owner.login : undefined
  });
}
