import { findLast, get, parseInt, replace } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const drClaw: IAchievement = {
  name: 'Dr. Claw',
  check: function(pullRequest, shall) {

    const coveragePercentageDecreased = coverageDecreased(pullRequest);

    if (coveragePercentageDecreased) {

      const achievement: IUserAchievement = {
        avatar: 'images/achievements/drClaw.achievement.gif',
        name: 'Dr. Claw',
        short: 'I\'ll get you next time, Gadget... next time!!',
        description: [
          'You\'ve decreased a project coverage by ',
          coveragePercentageDecreased
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function coverageDecreased(pullRequest) {
  const lastCoverageUpdate = findLast(pullRequest.comments,
    ['author.username', 'coveralls']);

  const lastCoverageUpdateMessage = get(lastCoverageUpdate, 'message');
  const getDecreasedPercentageRegexp = /Coverage decreased \((.*?)\)/g;
  const match = getDecreasedPercentageRegexp.exec(lastCoverageUpdateMessage);
  const percentageString = get(match, 1);
  const percentageNumberOnly = replace(percentageString, /[-%]/g, '');

  return parseInt(percentageNumberOnly, 10) >= 2 ? percentageString : false;

}
