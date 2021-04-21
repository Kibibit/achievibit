import { every, get, isArray } from 'lodash';

import { IAchievement } from './achievement.abstract';

export const reactionOnEveryComment: IAchievement = {
  name: 'Royal Flush',
  check: function(pullRequest, shall) {
    const doesCommentsExist =
      get(pullRequest.inlineComments, 'length') > 0 ||
      get(pullRequest.comments, 'length') > 0;
    const isReactionOnEverything =
      every(pullRequest.inlineComments, haveReactions) &&
      every(pullRequest.comments, haveReactions) &&
      every([ pullRequest ], haveReactions);

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
  return isArray(comment.reactions) &&
    get(comment.reactions, 'length') !== 0;
}
