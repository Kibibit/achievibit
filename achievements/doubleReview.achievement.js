var _ = require('lodash');

var doubleReview = {
  name: 'doubleReview',
  check: function(pullRequest, shall) {
    if (pullRequest.reviewers && pullRequest.reviewers.length === 2) {

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

      _.forEach(pullRequest.reviewers, function(reviewer) {
        shall.grant(reviewer.username, achieve);
      });
    }
  }
};

module.exports = doubleReview;
