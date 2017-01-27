var _ = require('lodash');

var helpingHand = {
  name: 'Helping Hand',
  check: function(pullRequest, shall) {
    var committedReviewers = reviewersWhoCommittedToPullRequest(pullRequest);

    if (!_.isEmpty(committedReviewers)) {

      var isMultipleCommittedReviewers =
        committedReviewers.length > 1 ? 's ' : ' ';

      var reviewerAchievement = {
        avatar: 'images/achievements/helpingHandHelloThere.achievement.jpg',
        name: 'Helping Hand',
        short: 'Hello there. Slow going?',
        description: [
          'You\'ve committed to ', pullRequest.creator.username,
          '\'s Pull Request you are reviewing'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      var committerAchievement = {
        avatar: 'images/achievements/helpingHandManInBlack.achievement.jpg',
        name: 'Helping Hand',
        short: [
          'Look, I don\'t mean to be rude but this is not as easy as it looks'
        ].join(''),
        description: [
          'Your reviewer', isMultipleCommittedReviewers,
          _.map(committedReviewers, 'username').join(', '),
          ' committed to your Pull Request'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      _.forEach(committedReviewers, function(reviewer) {
        shall.grant(reviewer.username, reviewerAchievement);
      });

      shall.grant(pullRequest.creator.username, committerAchievement);
    }
  }
};


function reviewersWhoCommittedToPullRequest(pullRequest) {
  var committedReviewers = [];

  _.forEach(pullRequest.commits, function(commit) {
    if (commit.author.username !== pullRequest.creator.username &&
      _.find(pullRequest.reviewers, {username: commit.author.username})) {
      committedReviewers.push(commit.author);
    }
  });

  return committedReviewers;
}

module.exports = helpingHand;
