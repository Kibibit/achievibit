var _ = require('lodash');

var mrMiyagi = {
  name: 'Mr Miyagi',
  check: function(pullRequest, shall) {

    var coveragePercentageTurned100 = coverageTurned100(pullRequest);

    if (coveragePercentageTurned100) {

      var achievement = {
        avatar: 'images/achievements/mrMiyagi.achievement.jpg',
        name: 'Mr Miyagi',
        short: [
          'Never put passion in front of principle, even if you win, ',
          'you’ll lose'
        ].join(''),
        description: [
          'You\'re the ultimate zen master. You increased a project coverage ',
          'to 100%. It was a long journey... but you know...<br>',
          '<b>',
          'First learn stand, then learn fly. Nature rule, ',
          pullRequest.creator.username, '-san, not mine',
          '</b>'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function coverageTurned100(pullRequest) {
  var lastCoverageUpdate = _.findLast(pullRequest.comments,
    ['author.username', 'coveralls']);

  var lastCoverageUpdateMessage = _.get(lastCoverageUpdate, 'message');
  var getTotalPercentageRegexp = /Coverage increased \(.*?\) to (.*?%)/g;
  var match = getTotalPercentageRegexp.exec(lastCoverageUpdateMessage);
  var totalCoverageString = _.get(match, 1);

  return totalCoverageString === '100.0%';

}

module.exports = mrMiyagi;
