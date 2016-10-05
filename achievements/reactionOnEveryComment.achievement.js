var _ = require('lodash');

var reactionOnEveryComment = {
	name: 'Royal Flush',
	check: function(pullRequest, shall) {
		if (pullRequest.inlineComments.length > 0 && _.every(pullRequest.inlineComments, haveReactions) &&
			pullRequest.comments.length > 0 && _.every(pullRequest.comments, haveReactions)) {
			shall.grant(pullRequest.creator.username, {
				avatar : 'https://s-media-cache-ak0.pinimg.com/originals/9c/c3/b4/9cc3b41044d93e03d0088538f908e3b7.png',
				name : 'royal flush',
				short : 'emojis on all of the comments',
				description : 'got for having lots of emojis',
				relatedPullRequest: pullRequest.id
			});
		}
	}
};

function haveReactions(comment) {
	return _.isArray(comment.reactions) && comment.reactions.length !== 0;
}

module.exports = reactionOnEveryComment;