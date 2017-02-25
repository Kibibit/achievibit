var _ = require('lodash');
// Gives achievement to comment authors who got all reactions
// without reacting themselves

var usedAllReactionsInComment = {
  name: 'Gladiator',
  check: function(pullRequest, shall) {
    var topAuthorsUsernames = getCommentAuthorsWithAllReactions(pullRequest);
    if (!_.isEmpty(topAuthorsUsernames)) {
      var achievement = {
        avatar: 'images/achievements/gladiator.achievement.gif',
        name: 'Gladiator',
        short: 'Are You Not Entertained?',
        description: [
          'You got all the reactions to your comment. You make everybody feel.'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      _.forEach(topAuthorsUsernames, function(author) {
        shall.grant(author, achievement);
      });
    }
  }
};

function getCommentAuthorsWithAllReactions(pullRequest) {
  var allComments = _.concat(pullRequest.comments, pullRequest.inlineComments);
  var authors = _.map(allComments, 'author.username');
  var AllCommentsReactions = _.map(allComments, 'reactions');

    // also add pull request description reactions
  authors.push(pullRequest.creator.username);
  AllCommentsReactions.push(pullRequest.reactions);

  getOnlyUniqueReactionsWithoutAuthors(AllCommentsReactions, authors);

  return onlyUsersWithAllReactions(authors, AllCommentsReactions);
}

function reactionsWithoutAuthor(reactions, author) {
  return _.map(_.reject(reactions, ['user.username', author]), 'reaction');
}

function getOnlyUniqueReactionsWithoutAuthors(AllCommentsReactions, authors) {
  _.forEach(AllCommentsReactions, function(reactions, index) {
    AllCommentsReactions[index] =
            _.uniq(reactionsWithoutAuthor(reactions, authors[index]));

  });
}

function onlyUsersWithAllReactions(authors, AllCommentsReactions) {
  var commentAuthorsWithAllReactions = [];

  _.forEach(authors, function(author, index) {
    if (AllCommentsReactions[index].length === 6) {
      commentAuthorsWithAllReactions.push(author);
    }
  });

  return commentAuthorsWithAllReactions;
}
module.exports = usedAllReactionsInComment;
