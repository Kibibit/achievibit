var moment = require('moment');

var member = {
  name: 'Member?',
  check: function(pullRequest, shall) {
    if (isWaitingLongTime(pullRequest)) {

      var achieve = {
        avatar : 'images/achievements/member.achievement.gif',
        name : 'Member?',
        short : 'Member Commits? member Push? member PR? ohh I member',
        description : [
          'A pull request you\'ve created 2 weeks ago',
          ' is finally merged'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

        shall.grant(pullRequest.author.username, achieve);
    }
  }
};

function isWaitingLongTime(pullRequest) {
  var backThen = moment(pullRequest.createdOn);
  var now = moment();

  return now.diff(backThen, 'minutes') > 5;
}

module.exports = member;
