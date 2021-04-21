import moment from 'moment';

import { IAchievement } from './achievement.abstract';

export const member: IAchievement = {
  name: 'Member?',
  check: function(pullRequest, shall) {
    if (isWaitingLongTime(pullRequest)) {

      const achieve = {
        avatar: 'images/achievements/member.achievement.jpg',
        name: 'Member pull request #' + pullRequest.number + '?',
        short: 'Member Commits? member Push? member PR? ohh I member',
        description: [
          'A pull request you\'ve created 2 weeks ago',
          ' is finally merged'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};

function isWaitingLongTime(pullRequest) {
  const backThen = moment(pullRequest.createdOn);
  const now = moment();

  return now.diff(backThen, 'days') > 14;
}
