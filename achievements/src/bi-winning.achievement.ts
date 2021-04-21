import { every, isEmpty } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const biWinning: IAchievement = {
  name: 'bi-winning',
  check: function(pullRequest, shall) {
    if (!isEmpty(pullRequest.commits) &&
      every(pullRequest.commits, allStatusesPassed)) {

      const achievement: IUserAchievement = {
        avatar: 'images/achievements/biWinning.achievement.jpg',
        name: 'BI-WINNING!',
        short: 'I\'m bi-winning. I win here and I win there',
        description: [
          '<p>All the commits in your pull-request have passing statuses! ',
          'WINNING!</p>',
          '<p>I\'m different. I have a different constitution, I have a ',
          'different brain, I have a different heart. I got tiger blood, man. ',
          'Dying\'s for fools, dying\'s for amateurs.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function allStatusesPassed(commit) {
  return !isEmpty(commit.statuses) &&
    every(commit.statuses, { state: 'success' });
}
