import { find } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const githubBot: IAchievement = {
  name: 'use github bot',
  check: function(pullRequest, shall) {
    const isComitterGitHubWebFlow = find(pullRequest.commits, {
      committer: {
        username: 'web-flow'
      }
    });
    if (pullRequest.commits &&
			pullRequest.commits.length > 0 &&
			isComitterGitHubWebFlow) {

      const achieve: IUserAchievement = {
        avatar: 'images/achievements/useGithubBot.achievement.jpeg',
        name: 'Why not bots?',
        short: 'Hey sexy mama, wanna kill all humans?',
        description: [
          'used github to create a pull request, using the web-flow bot'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};
