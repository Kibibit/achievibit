import { find, forEach, isEmpty, map } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

export const helpingHand: IAchievement = {
  name: 'Helping Hand',
  check: function(pullRequest, shall) {
    const committedReviewers = reviewersWhoCommittedToPullRequest(pullRequest);

    if (!isEmpty(committedReviewers)) {

      const isMultipleCommittedReviewers =
        committedReviewers.length > 1 ? 's ' : ' ';

      const reviewerAchievement: IUserAchievement = {
        avatar: 'images/achievements/helpingHandHelloThere.achievement.jpg',
        name: 'Helping Hand',
        short: 'Hello there. Slow going?',
        description: [
          'You\'ve committed to ', pullRequest.creator.username,
          '\'s Pull Request you are reviewing'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      const committerAchievement = {
        avatar: 'images/achievements/helpingHandManInBlack.achievement.jpg',
        name: 'Helping Hand',
        short: [
          'Look, I don\'t mean to be rude but this is not as easy as it looks'
        ].join(''),
        description: [
          'Your reviewer', isMultipleCommittedReviewers,
          map(committedReviewers, 'username').join(', '),
          ' committed to your Pull Request'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      forEach(committedReviewers, function(reviewer) {
        shall.grant(reviewer.username, reviewerAchievement);
      });

      shall.grant(pullRequest.creator.username, committerAchievement);
    }
  }
};


function reviewersWhoCommittedToPullRequest(pullRequest) {
  const committedReviewers = [];

  forEach(pullRequest.commits, function(commit) {
    if (commit.author.username !== pullRequest.creator.username &&
      find(pullRequest.reviewers, {username: commit.author.username})) {
      committedReviewers.push(commit.author);
    }
  });

  return committedReviewers;
}
