var _ = require('lodash');
var console = process.console;
//Gives achievement to comment authors who got all reactions without reacting themselves

var usedAllReactionsInComment = {
	name: 'The Beatles',
	check: function(pullRequest, shall) {
    if (!_.isEmpty(pullRequest.comments)){
      var topComments = commentsWithAllReactions(pullRequest.comments); //array of comments with all reactions in them
    }

		if ( !_.isEmpty(topComments) ) {

			var achievement = {
				avatar : '',
				name: 'The Beatles',
				short: 'All you need is love',
				description: 'You got all the reactions to your comment. You make everybody feel.',
				relatedPullRequest: pullRequest._id
			};

			_.forEach(topComments, function(comment) { //foreach comment that succeded give acheivemnt to author
        shall.grant(comment.author.username, achievement);
      });
		}
	}
};


function commentsWithAllReactions(comments) {
  console.log("I'm inside: commentsWithAllReactions");
  var allReactions = ['+1', '-1', 'laugh', 'confused', 'heart', 'hooray'];
  console.log("here are all reactions: " + allReactions);
  var topComments =[];

  _.forEach(comments, function(comment) {//iterate over comments
    if(!_.isEmpty(comments.reactions)){//if there are reactions
      var localReactions = [];

      _.forEach(comment.reactions, function(reaction){//if (comment has all reactions)
        //if (reaction.user.username != comment.author.username) { //didn't react to self
          localReactions.push(reaction.reaction);
      //  }
        console.log("localReactions after run:" +localReactions);
      });
      if (_.difference(allReactions, localReactions).length === 0) {//all reactions used in this comment
        topComments.push(comment); //add comment to topComments
      }
    }
  });
  return topComments;
}

module.exports = usedAllReactionsInComment;
