import { forEach, isEqual } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const breakingBad: IAchievement = {
  name: 'Breaking Bad',
  check: function(pullRequest, shall) {
    if (atLeast80PrecentCommitsFailedBuild(pullRequest)) {

      const achievement: IUserAchievement = {
        avatar: 'images/achievements/breakingBad.achievement.jpg',
        name: 'Breaking Bad',
        short: [
          'Look, let\'s start with some tough love. ',
          'You two suck at peddling meth. Period.'
        ].join(''),
        description: [
          'You merged a Pull Request with 5 or more commits with failing status'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function atLeast80PrecentCommitsFailedBuild(pullRequest) {
  let failedCommits = 0;
  const totalCommits = pullRequest.commits.length;
  forEach(pullRequest.commits, function(commit) {
    const TRAVIS_PR = 'continuous-integration/travis-ci/pr';
    const TRAVIS_PUSH = 'continuous-integration/travis-ci/push';
    const prBuildStatus = commit.statuses[TRAVIS_PR];
    const pushBuildStatus = commit.statuses[TRAVIS_PUSH];
    if ((prBuildStatus && isEqual(prBuildStatus.state, 'error')) ||
			(pushBuildStatus && isEqual(pushBuildStatus.state, 'error'))) {
      failedCommits++;
    }
  });

  return ((failedCommits / totalCommits) * 100) >= 80;
}
