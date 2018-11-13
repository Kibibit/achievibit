var _ = require('lodash');
var moment = require('moment');

var meepMeep = {
  name: 'Meep Meep',
  check: function(pullRequest, shall) {

    var earliestComment = getEarlierComment(pullRequest);
    

    if (
      earliestComment &&
      isCommentedInTime(pullRequest, earliestComment)) {

        var achievement = {
          avatar: 'images/achievements/meepMeep.achievement.gif',
          name: 'Meep Meep',
          short: 'Wile E. Coyote will stay hungry today',
          description: [
            'You\'ve commented on a Pull Request within 5 minutes, ',
            'that\'s pretty quick... for a human'
          ].join(''),
          relatedPullRequest: pullRequest.id
        };

        shall.grant(earliestComment.author.username, achievement);
    }
  }
};

function getEarlierComment(pullRequest) {
  var inline = _.first(pullRequest.inlineComments);
  var regular = _.first(pullRequest.comments)

  var inlineCreated = _.get(inline, 'createdOn');
  var regularCreated = _.get(regular, 'createdOn');

  return moment(inlineCreated).isBefore(regularCreated) ? inline : regular;
}

function isCommentedInTime(pullRequest, earliestComment) {
  var timeLimit = moment(pullRequest.createdOn).add(5, 'minutes');
  return moment(earliestComment.createdOn).isBefore(timeLimit);
}

module.exports = meepMeep;
