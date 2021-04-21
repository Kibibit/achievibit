import { result } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const theGodfatherConsigliere: IAchievement = {
  name: 'The Godfather Consigliere',
  check: function(pullRequest, shall) {
    if (result(pullRequest, 'organization.username') === 'Kibibit') {

      const achievement: IUserAchievement = {
        avatar: 'images/achievements/theGodfatherConsigliere.achievement.jpg',
        name: 'The Godfather Consigliere',
        short: 'Great men are not born great, they contribute to Kibibit . . .',
        description: [
          '<p>You have contributed to Kibibit! We really ',
          'appreciate it!</p>',
          '<p>Accept this achievement as gift on ',
          'my daughter\'s wedding day</p>'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};
