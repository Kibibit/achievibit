var _ = require('lodash');
var console = process.console;
//Gives achievement to comment authors who got all reactions without reacting themselves
//TODO: make it work for inline comments also

var usedAllReactionsInComment = {
	name: 'Gladiator',
	check: function(pullRequest, shall) {
    var topComments = objectsWithAllReactions(pullRequest); //array of comments/inline/pr with all reactions in them
    if ( !_.isEmpty(topComments) ) {
    var achievement = {
      avatar : 'images/achievements/gladiator.achievement.gif',
      name: 'Gladiator',
      short: 'Are You Not Entertained?',
      description: 'You got all the reactions to your comment. You make everybody feel.',
      relatedPullRequest: pullRequest._id
    };

    _.forEach(topComments, function(comment) { //foreach comment that succeded give acheivemnt to author
      shall.grant(comment.author.username, achievement);
    });
  }
	}
};

function appendIfHasAllReactions (topComments, comment){
  if(!_.isEmpty(comment.reactions)){//if there are reactions
    var allReactions = ['+1', '-1', 'laugh', 'confused', 'heart', 'hooray'];
    var localReactions = [];
    console.log("I'm inside: appendIfHasAllReactions");
    _.forEach(comment.reactions, function(reaction){//colect reactions
      if (reaction.user.username != comment.author.username) { //didn't react to self
        localReactions.push(reaction.reaction);
      }
      console.log("localReactions after run:" +localReactions);
    });
    if (_.difference(allReactions, localReactions).length === 0) {//all reactions used in this comment
      topComments.push(comment); //add comment to topComments
    }
  }
}

function commentsWithAllReactions(pullRequest) {
  console.log("I'm inside: commentsWithAllReactions");
  
  var comments = pullRequest.comments;
  var inlineComments = pullRequest.inlineComments
  var topComments =[]; //objects with all reactions are saved here (PR/comment/inline)

//////////////If PR////////////////////////////
  appendIfHasAllReactions(topComments, pullRequest);

  ////////Iterate over comments//////////////////
  if (!_.isEmpty(comments){
    _.forEach(comments, function(comment) {
      appendIfHasAllReactions(topComments, comment);
    });
  }

  ///////////////////Iterate over inlineComments//////////////////
  if (!_.isEmpty(comments){
    _.forEach(inlineComments, function(inlineComments) {
      appendIfHasAllReactions (topComments, inlineComments);
    });
  }

  return topComments;
}

module.exports = usedAllReactionsInComment;
