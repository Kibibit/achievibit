var _ = require('lodash');
var moment = require('moment');

var allNighter = {
  name: 'All Nighter',
  check: function(pullRequest, shall) {
    if (isProgrammerAnOwl(pullRequest)) {

      var achievement = {
        avatar : 'images/achievements/allNighter.achievement.jpg',
        name: 'All Nighter',
        short: 'The sun is almost rising, the coffee mug is empty, it\'s enough, go to sleep.',
        description: 'You\'ve created a Pull request between 4 and 6 AM',
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

function isProgrammerAnOwl(pullRequest) {
  var creationHour = moment(pullRequest.createdOn).format('H');

  return 4 <= creationHour && creationHour < 6;
}

module.exports = allNighter;
