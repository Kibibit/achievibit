import { findLast, get } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const mrMiyagi: IAchievement = {
  name: 'Mr Miyagi',
  check: function(pullRequest, shall) {

    if (isCoverageTurened100(pullRequest)) {

      const achievement: IUserAchievement = {
        avatar: 'images/achievements/mrMiyagi.achievement.jpg',
        name: 'Mr Miyagi',
        short: [
          'Never put passion in front of principle, even if you win, ',
          'you’ll lose'
        ].join(''),
        description: [
          'You\'re the ultimate zen master. You increased a project coverage ',
          'to 100%. It was a long journey... but you know...<br>',
          '<b>',
          'First learn stand, then learn fly. Nature rule, ',
          pullRequest.creator.username, '-san, not mine',
          '</b>'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function isCoverageTurened100(pullRequest) {
  const lastCoverageUpdate = findLast(pullRequest.comments,
    ['author.username', 'coveralls']);

  const lastCoverageUpdateMessage = get(lastCoverageUpdate, 'message');
  const getTotalPercentageRegexp = /Coverage increased \(.*?\) to (.*?%)/g;
  const match = getTotalPercentageRegexp.exec(lastCoverageUpdateMessage);
  const totalCoverageString = get(match, 1);

  return totalCoverageString === '100.0%';

}
