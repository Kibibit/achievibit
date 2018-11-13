var _ = require('lodash');

var doubleReview = {
  name: 'doubleReview',
  check: function(pullRequest, shall) {
    // clone the reviewers to not mutate the original pullRequest
    var reviewers = _.clone(pullRequest.reviewers);
    _.remove(reviewers, {
      username: pullRequest.creator.username
    });
    if (reviewers && reviewers.length === 2) {

      var achieve = {
        avatar: 'images/achievements/doubleReview.achievement.gif',
        name: 'We\'re ready, master',
        short: _.escape('"This way!"-"No, that way!"'),
        description: [
          'double headed code review.<br>It doesn\'t matter who added you, ',
          'apparently, both of you are needed for a one man job 😇'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      _.forEach(reviewers, function(reviewer) {
        shall.grant(reviewer.username, achieve);
      });
    }
  }
};

module.exports = doubleReview;
