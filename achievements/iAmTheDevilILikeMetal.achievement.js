var iAmTheDevilILikeMetal = {
  name: 'I am the devil I like metal',
  check: function(pullRequest, shall) {
    if (isSequenceOfSixes(pullRequest.number)) {

      var achieve = {
        avatar: 'images/achievements/iAmTheDevilILikeMetal.achievement.jpg',
        name: 'I am the devil I like metal',
        short: 'Check this riff, it\'s fucking tasty',
        description: [
          'your pull request id '+str(pullRequest.number)+ 'summoned the devil himself! ',
          pullRequest.number
        ].join(''),
        relatedPullRequest: pullRequest.id
      };
      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};

function isSequenceOfSixes(number) {
  const twoOrMoreSixesRegex = /^66+$/;

  return twoOrMoreSixesRegex.test(number);

}

module.exports = iAmTheDevilILikeMetal;
