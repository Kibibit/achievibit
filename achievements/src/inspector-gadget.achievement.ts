import { findLast, get, parseInt, replace } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const inspectorGadget: IAchievement = {
  name: 'Inspector Gadget',
  check: function(pullRequest, shall) {

    const coveragePercentageIncreased = coverageIncreased(pullRequest);

    if (coveragePercentageIncreased) {

      const achievement: IUserAchievement = {
        avatar: 'images/achievements/inspectorGadget.achievement.jpg',
        name: 'Inspector Gadget',
        short: [
          'I\'m always careful, Penny. That\'s what makes me ',
          'a great inspector.'
        ].join(''),
        description: [
          'You\'ve increased a project coverage by ',
          coveragePercentageIncreased
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function coverageIncreased(pullRequest) {
  const lastCoverageUpdate = findLast(pullRequest.comments,
    ['author.username', 'coveralls']);

  const lastCoverageUpdateMessage = get(lastCoverageUpdate, 'message');
  const getIncreasedPercentageRegexp = /Coverage increased \((.*?)\)/g;
  const match = getIncreasedPercentageRegexp.exec(lastCoverageUpdateMessage);
  const percentageString = get(match, 1);
  const percentageNumberOnly = replace(percentageString, /[+%]/g, '');

  return parseInt(percentageNumberOnly, 10) >= 2 ? percentageString : false;

}
