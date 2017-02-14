var _ = require('lodash');

var reactionOnEveryComment = {
  name: 'Royal Flush',
  check: function(pullRequest, shall) {
    var doesCommentsExist =
      _.get(pullRequest.inlineComments, 'length') > 0 ||
      _.get(pullRequest.comments, 'length') > 0;
    var isReactionOnEverything =
      _.every(pullRequest.inlineComments, haveReactions) &&
      _.every(pullRequest.comments, haveReactions) &&
      _.every([ pullRequest ], haveReactions);

    if (doesCommentsExist && isReactionOnEverything) {

      shall.grant(pullRequest.creator.username, {
        avatar: 'images/achievements/reactionOnEveryComment.achievement.png',
        name: 'royal flush',
        short: 'emojis on all of the comments',
        description: [
          'got for having at least one comment\\inline comment, ',
          'and all of them (including the PR description) had reactions'
        ].join(''),
        relatedPullRequest: pullRequest.id
      });

    }
  }
};

function haveReactions(comment) {
  return _.isArray(comment.reactions) &&
    _.get(comment.reactions, 'length') !== 0;
}

module.exports = reactionOnEveryComment;
