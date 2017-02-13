var _ = require('lodash');

var drClaw = {
  name: 'Dr. Claw',
  check: function(pullRequest, shall) {

    var coveragePercentageDecreased = coverageDecreased(pullRequest);

    if (coveragePercentageDecreased) {

      var achievement = {
        avatar: 'images/achievements/drClaw.achievement.gif',
        name: 'Dr. Claw',
        short: 'I\'ll get you next time, Gadget... next time!!',
        description: [
          'You\'ve decreased a project coverage by ',
          coveragePercentageDecreased
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function coverageDecreased(pullRequest) {
  var lastCoverageUpdate = _.findLast(pullRequest.comments,
    ['author.username', 'coveralls']);

  var lastCoverageUpdateMessage = _.get(lastCoverageUpdate, 'message');
  var getDecreasedPercentageRegexp = /Coverage decreased \((.*?)\)/g;
  var match = getDecreasedPercentageRegexp.exec(lastCoverageUpdateMessage);
  var percentageString = _.get(match, 1);
  var percentageNumberOnly = _.replace(percentageString, /[-%]/g, '');

  return _.parseInt(percentageNumberOnly, 10) >= 2 ? percentageString : false;

}

module.exports = drClaw;
