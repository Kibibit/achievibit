
var meepMeep = {
  name: 'Meep Meep',
  check: function(pullRequest, shall) {

    var earliestComment = null;

    if (pullRequest.comments != [] && pullRequest.inlineComments != []) {
      earliestComment = getEarlierComment(
        pullRequest.comments[0],
        pullRequest.inlineComments[0]
      );
    } else if (pullRequest.comments != []) {
      earliestComment = pullRequest.comments[0];
    } else if (pullRequest.inlineComments != []) {
      earliestComment = pullRequest.inlineComments[0];
    }

    if (
      earliestComment &&
      isCommentedInTime(pullRequest.createdOn, earliestComment.createdOn)) {

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
  return new Date(commentA.createdOn) < new Date(commentB.createdOn) ? commentA : commentB;
}

function isCommentedInTime(pullRequestDateString, commentDateString) {

  const pullRequestDate = new Date(pullRequestDateString);
  const achievementTimeLimit = pullRequestDate.getTime() + 5*60000;
  const commentTime = new Date(commentDateString).getTime();

  return commentTime < achievementTimeLimit;  
}

module.exports = meepMeep;
