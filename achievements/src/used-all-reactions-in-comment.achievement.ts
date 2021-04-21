import { concat, forEach, isEmpty, map, reject, uniq } from 'lodash';

import { IAchievement, IUserAchievement } from './achievement.abstract';

// Gives achievement to comment authors who got all reactions
// without reacting themselves

export const usedAllReactionsInComment: IAchievement = {
  name: 'Gladiator',
  check: function(pullRequest, shall) {
    const topAuthorsUsernames = getCommentAuthorsWithAllReactions(pullRequest);
    if (!isEmpty(topAuthorsUsernames)) {
      const achievement: IUserAchievement = {
        avatar: 'images/achievements/gladiator.achievement.gif',
        name: 'Gladiator',
        short: 'Are you not ENTERTAINED?!',
        description: [
          'Your message got all the possible reactions. ',
          'Enjoy your 15 minutes of fame'
        ].join(''),
        relatedPullRequest: pullRequest.id
      };

      forEach(topAuthorsUsernames, function(author) {
        shall.grant(author, achievement);
      });
    }
  }
};

function getCommentAuthorsWithAllReactions(pullRequest) {
  const allComments = concat(pullRequest.comments, pullRequest.inlineComments);
  const authors = map(allComments, 'author.username');
  const AllCommentsReactions = map(allComments, 'reactions');

    // also add pull request description reactions
  authors.push(pullRequest.creator.username);
  AllCommentsReactions.push(pullRequest.reactions);

  getOnlyUniqueReactionsWithoutAuthors(AllCommentsReactions, authors);

  return onlyUsersWithAllReactions(authors, AllCommentsReactions);
}

function reactionsWithoutAuthor(reactions, author) {
  return map(reject(reactions, ['user.username', author]), 'reaction');
}

function getOnlyUniqueReactionsWithoutAuthors(AllCommentsReactions, authors) {
  forEach(AllCommentsReactions, function(reactions, index) {
    AllCommentsReactions[index] =
            uniq(reactionsWithoutAuthor(reactions, authors[index]));

  });
}

function onlyUsersWithAllReactions(authors, AllCommentsReactions) {
  const commentAuthorsWithAllReactions = [];

  forEach(authors, function(author, index) {
    if (AllCommentsReactions[index].length === 6) {
      commentAuthorsWithAllReactions.push(author);
    }
  });

  return commentAuthorsWithAllReactions;
}
