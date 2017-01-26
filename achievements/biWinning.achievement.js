var _ = require('lodash');

var biWinning = {
  name: 'bi-winning',
  check: function(pullRequest, shall) {
    if (_.every(pullRequest.commits, allStatusesPassed)) {

      var achievement = {
        avatar: 'images/achievements/biWinning.achievement.jpg',
        name: 'BI-WINNING!',
        short: 'I\'m bi-winning. I win here and I win there',
        description: [
          'All the commits in your pull-request have passing statuses! WINNING!',
          '\n\n',
          'I\'m different. I have a different constitution, I have a different brain, I have a different heart. I got tiger blood, man. Dying\'s for fools, dying\'s for amateurs.'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};


function allStatusesPassed(commit) {
  return _.every(commit.statuses, { state: 'success' })
}

module.exports = biWinning;
