var meepMeep = {
  name: 'Meep Meep',
  check: function(pullRequest, shall) {

    const earliestComment = getEarlierComment(
        pullRequest.comments[0],
        pullRequest.inlineComments[0]
    );

    if (isCommentedInTime(pullRequest.createdOn,earliestComment.createdOn)) {

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

function getEarlierComment(commentA, commentB) {
  return Date(commentA) > Date(commentB) ? commentA : commentB;
}

function isCommentedInTime(pullRequestDateString,commentDateString) {

  const pullRequestDateachievementTimeLimit =
    new Date(pullRequestDateString).getTime() + 5*60000;

  const commentDate = new Date(commentDateString).getTime();
  return commentDate <= pullRequestDateachievementTimeLimit;  
}

module.exports = meepMeep;
