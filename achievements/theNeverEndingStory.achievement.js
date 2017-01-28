var theNeverEndingStory = {
  name: 'The NeverEnding Story',
  check: function(pullRequest, shall) {
    if (pullRequest.commits.length > 10) {

      var achievement = {
        avatar: 'images/achievements/theNeverEndingStory.achievement.jpg',
        name: 'The NeverEnding Story',
        short: 'Never give up and good luck will find you.',
        description: [
          '<p>This PR was defiently a mighty quest! ',
          'you had more then 10 commits!</p><p>',
          'If we\'re about to die anyway, I\'d rather die fighting! ',
          'Come for me, PR! <b>I am ',
          pullRequest.creator.username, '!</b> ⚔</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      };

      shall.grant(pullRequest.creator.username, achievement);
    }
  }
};

module.exports = theNeverEndingStory;
