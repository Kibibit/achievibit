import { clone, escape, forEach, remove } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const doubleReview: IAchievement = {
  name: 'doubleReview',
  check: function(pullRequest, shall) {
    // clone the reviewers to not mutate the original pullRequest
    const reviewers = clone(pullRequest.reviewers);
    remove(reviewers, {
      username: pullRequest.creator.username
    });
    if (reviewers && reviewers.length === 2) {

      const achieve: IUserAchievement = {
        avatar: 'images/achievements/doubleReview.achievement.gif',
        name: 'We\'re ready, master',
        short: escape('"This way!"-"No, that way!"'),
        description: [
          'double headed code review.<br>It doesn\'t matter who added you, ',
          'apparently, both of you are needed for a one man job 😇'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      forEach(reviewers, function(reviewer) {
        shall.grant(reviewer.username, achieve);
      });
    }
  }
};
