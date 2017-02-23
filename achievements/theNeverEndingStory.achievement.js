var theNeverEndingStory = {
  name: 'The NeverEnding Story',
  accumulative: true,
  check: function(pullRequest, shall, treasures) {
    var creatorTreasure = treasures[pullRequest.creator.username] || 0;
    var accumulativeAchievements = {
      1: {
        avatar: 'images/achievements/theNeverEndingStory.achievement.jpg',
        name: 'The NeverEnding Story (Bronze)',
        short: 'Never give up and good luck will find you.',
        description: [
          '<p>This PR was defiently a mighty quest! ',
          'you had more then 10 commits!</p><p>',
          'If we\'re about to die anyway, I\'d rather die fighting! ',
          'Come for me, PR! <b>I am ',
          pullRequest.creator.username, '!</b> ⚔</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      5: {
        avatar: 'images/achievements/theNeverEndingStory.5.achievement.jpg',
        name: 'The NeverEnding Story (Silver)',
        short: 'I will not die easily. I am a warrior!',
        description: [
          '<p>This is your 5th pull request that had more than 10 commits. ',
          'Someone likes a challenge, huh?</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      10: {
        avatar: 'images/achievements/theNeverEndingStory.10.achievement.jpg',
        name: 'The NeverEnding Story (Gold)',
        short: 'One grain of sand. It is all that remains of my vast empire',
        description: [
          '<p>This is your 10th pull request that had ',
          'more than 10 commits.</p>',
          '<p>Looks like you\'re an expert in getting yourself in trouble. ',
          'Don\'t worry, we can arise anew, from your dreams and wishes, ',
          pullRequest.creator.username, '.</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      },
      20: {
        avatar: 'images/achievements/theNeverEndingStory.20.achievement.jpg',
        name: 'The NeverEnding Story (Platinum)',
        short: [
          'If you want to save our world, you must hurry. ',
          'We don\'t know how much longer we can withstand the nothing.'
        ].join(''),
        description: [
          '<p>This is your 10th pull request that had ',
          'more than 10 commits.</p>',
          '<p>Do not be afraid! We will not harm you! ',
          'We have been waiting for you a long time, ',
          pullRequest.creator.username, '!</p>'
        ].join(''),
        relatedPullRequest: pullRequest._id
      }
    };

    if (pullRequest.commits.length  >= 10) {

      creatorTreasure = creatorTreasure + 1;

      if (accumulativeAchievements[creatorTreasure]) {
        shall.grant(pullRequest.creator.username,
          accumulativeAchievements[creatorTreasure]);
      }

      shall.progress(pullRequest.creator.username, creatorTreasure);
    }
  }
};

module.exports = theNeverEndingStory;
