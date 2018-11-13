var _ = require('lodash');

var inspectorGadget = {
  name: 'Inspector Gadget',
  check: function(pullRequest, shall) {

    var coveragePercentageIncreased = coverageIncreased(pullRequest);

    if (coveragePercentageIncreased) {

      var achievement = {
        avatar: 'images/achievements/inspectorGadget.achievement.jpg',
        name: 'Inspector Gadget',
        short: [
          'I\'m always careful, Penny. That\'s what makes me ',
          'a great inspector.'
        ].join(''),
        description: [
          'You\'ve increased a project coverage by ',
          coveragePercentageIncreased
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function coverageIncreased(pullRequest) {
  var lastCoverageUpdate = _.findLast(pullRequest.comments,
    ['author.username', 'coveralls']);

  var lastCoverageUpdateMessage = _.get(lastCoverageUpdate, 'message');
  var getIncreasedPercentageRegexp = /Coverage increased \((.*?)\)/g;
  var match = getIncreasedPercentageRegexp.exec(lastCoverageUpdateMessage);
  var percentageString = _.get(match, 1);
  var percentageNumberOnly = _.replace(percentageString, /[+%]/g, '');

  return _.parseInt(percentageNumberOnly, 10) >= 2 ? percentageString : false;

}

module.exports = inspectorGadget;
