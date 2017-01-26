var _ = require('lodash');

var helpingHand = {
  name: 'Helping Hand',
  check: function(pullRequest, shall) {
    var committedReviewers = reviewersWhoCommittedToPullRequest(pullRequest);

    if (!_.isEmpty(committedReviewers)) {

      var achievement = {
        avatar: 'images/achievements/helpingHand.achievement.jpg',
        name: 'Helping Hand',
        short: 'Let me help you finishing up here...',
        description: 'You\'ve committed to a Pull Request you are reviewing',
        relatedPullRequest: pullRequest._id
      };

      _.forEach(committedReviewers, function(reviewer) {
        shall.grant(reviewer.username, achievement);
      });
    }
  }
};


function reviewersWhoCommittedToPullRequest(pullRequest) {
  var committedReviewers = [];

  _.forEach(pullRequest.commits, function(commit) {
    if (_.includes(pullRequest.reviewers, commit.creator.username)) {
      committedReviewers.push(commit.creator);
    }
  });

  return committedReviewers;
}

module.exports = helpingHand;