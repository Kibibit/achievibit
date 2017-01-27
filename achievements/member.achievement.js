var moment = require('moment');

var member = {
  name: 'Member?',
  check: function(pullRequest, shall) {
    if (isWaitingLongTime(pullRequest)) {

      var achieve = {
        avatar: 'images/achievements/member.achievement.jpg',
        name: 'Member pull request #' + pullRequest.number + '?',
        short: 'Member Commits? member Push? member PR? ohh I member',
        description: [
          'A pull request you\'ve created 2 weeks ago',
          ' is finally merged'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};

function isWaitingLongTime(pullRequest) {
  var backThen = moment(pullRequest.createdOn);
  var now = moment();

  return now.diff(backThen, 'weeks') > 2;
}

module.exports = member;
