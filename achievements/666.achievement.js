var sixes = {
  name: 'I am the devil I like metal',
  check: function(pullRequest, shall) {
    if (isPrime(pullRequest.number)) {

      var achieve = {
        avatar: 'images/achievements/666.achievement.jpg',
        name: 'optimus prime',
        short: 'You\'re pull request was develish',
        description: [
          'A pull request with the number of the beast ',
          pullRequest.number
        ].join(''),
        relatedPullRequest: pullRequest.id
      };
      shall.grant(pullRequest.creator.username, achieve);
    }
  }
};

function hasSix(n) {
  // convert the pull request number into a string
  var num = n.toString();
  //if numer has less than 2 digits or has digit that is not 6 return flase
  if (num.length<2){
    return false;
  }
  for (var i = 0; i < num.length; i++) {
    if (num[i]!='6'){
      return false;
    };
  }
  // if all checks pass return true
  return true;

}

module.exports = sixes;
